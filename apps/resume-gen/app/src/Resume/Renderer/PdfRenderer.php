<?php

declare(strict_types=1);

namespace Resume\Renderer;

use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

/**
 * Prints an HTML document to PDF with headless Chromium, falling back to wkhtmltopdf.
 */
final class PdfRenderer
{
    public const ENGINE_CHROMIUM = 'chromium';
    public const ENGINE_WKHTMLTOPDF = 'wkhtmltopdf';

    private const CHROMIUM_CANDIDATES = [
        'chromium',
        'chromium-browser',
        'google-chrome',
        'google-chrome-stable',
        'chrome',
        'brave-browser',
        'microsoft-edge',
    ];

    private ?string $engine = null;
    private ?string $binary = null;

    public function __construct(?string $engine = null, private readonly float $timeout = 30.0)
    {
        $engine ??= getenv('RESUME_PDF_ENGINE') ?: null;

        $this->detect(\is_string($engine) && '' !== $engine ? $engine : null);
    }

    public function engine(): ?string
    {
        return $this->engine;
    }

    public function binary(): ?string
    {
        return $this->binary;
    }

    public function render(string $html, string $destination): void
    {
        if (null === $this->engine || null === $this->binary) {
            throw new \RuntimeException('No PDF engine is available.');
        }

        $html = $this->markPdfBody($html);

        $workDir = \dirname($destination);
        $tmpHtml = $workDir.\DIRECTORY_SEPARATOR.'.tmp_pdf_source_'.bin2hex(random_bytes(4)).'.html';
        $tmpProfile = $workDir.\DIRECTORY_SEPARATOR.'.tmp_chrome_profile_'.bin2hex(random_bytes(4));
        file_put_contents($tmpHtml, $html);
        mkdir($tmpProfile, 0o700, true);

        try {
            if (is_file($destination)) {
                @unlink($destination);
            }

            $command = self::ENGINE_CHROMIUM === $this->engine
                ? $this->chromiumCommand($tmpHtml, $destination, $tmpProfile)
                : [$this->binary, '--quiet', '--enable-local-file-access', $tmpHtml, $destination];

            $process = new Process($command, null, null, null, $this->timeout);

            try {
                $process->run();
            } catch (\Symfony\Component\Process\Exception\ProcessTimedOutException $exception) {
                // Headless Chrome can write the PDF and then hang; fall through to the file check.
                if (!is_file($destination) || filesize($destination) <= 0) {
                    throw $exception;
                }
            }

            // Headless Chrome sometimes writes the PDF and then hangs; accept the file if present.
            if (is_file($destination) && filesize($destination) > 0) {
                return;
            }

            throw new \RuntimeException(\sprintf("PDF generation failed (%s):\n%s", $this->engine, trim($process->getErrorOutput().$process->getOutput())));
        } finally {
            @unlink($tmpHtml);
            $this->removeDirectory($tmpProfile);
        }
    }

    /**
     * The templates ship print-specific rules under `body.pdf`.
     */
    public function markPdfBody(string $html): string
    {
        $marked = preg_replace_callback(
            '/<body([^>]*)>/i',
            static function (array $matches): string {
                $attributes = $matches[1];

                if (preg_match('/\sclass\s*=\s*(["\'])(.*?)\1/i', $attributes, $class)) {
                    $classes = trim($class[2].' pdf');

                    return '<body'.str_replace($class[0], \sprintf(' class="%s"', $classes), $attributes).'>';
                }

                return '<body'.$attributes.' class="pdf">';
            },
            $html,
            1,
        );

        return $marked ?? $html;
    }

    /**
     * @return list<string>
     */
    private function chromiumCommand(string $sourceHtml, string $destination, string $userDataDir): array
    {
        return [
            (string) $this->binary,
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-default-browser-check',
            '--hide-scrollbars',
            '--run-all-compositor-stages-before-draw',
            '--virtual-time-budget=5000',
            '--user-data-dir='.$userDataDir,
            '--no-pdf-header-footer',
            '--print-to-pdf='.$destination,
            'file://'.realpath($sourceHtml),
        ];
    }

    private function removeDirectory(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST,
        );

        foreach ($iterator as $file) {
            $path = $file->getPathname();
            if ($file->isDir()) {
                @rmdir($path);
            } else {
                @unlink($path);
            }
        }

        @rmdir($directory);
    }

    private function detect(?string $preferred): void
    {
        $finder = new ExecutableFinder();

        $chromium = $this->findChromium($finder);
        $wkhtmltopdf = $finder->find('wkhtmltopdf');

        if (self::ENGINE_WKHTMLTOPDF === $preferred) {
            $this->select(self::ENGINE_WKHTMLTOPDF, $wkhtmltopdf);

            return;
        }

        if (self::ENGINE_CHROMIUM === $preferred) {
            $this->select(self::ENGINE_CHROMIUM, $chromium);

            return;
        }

        if (null !== $chromium) {
            $this->select(self::ENGINE_CHROMIUM, $chromium);
        } elseif (null !== $wkhtmltopdf) {
            $this->select(self::ENGINE_WKHTMLTOPDF, $wkhtmltopdf);
        }
    }

    private function select(string $engine, ?string $binary): void
    {
        if (null === $binary) {
            return;
        }

        $this->engine = $engine;
        $this->binary = $binary;
    }

    private function findChromium(ExecutableFinder $finder): ?string
    {
        $configured = getenv('RESUME_CHROMIUM_PATH') ?: getenv('CHROME_PATH') ?: getenv('PUPPETEER_EXECUTABLE_PATH');

        if (\is_string($configured) && '' !== $configured && is_executable($configured)) {
            return $configured;
        }

        foreach (self::CHROMIUM_CANDIDATES as $candidate) {
            $found = $finder->find($candidate);

            if (null !== $found) {
                return $found;
            }
        }

        // macOS application bundles are not on PATH.
        foreach ([
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
        ] as $bundle) {
            if (is_executable($bundle)) {
                return $bundle;
            }
        }

        return null;
    }
}
