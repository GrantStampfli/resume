<?php

declare(strict_types=1);

namespace Resume\Renderer;

use Michelf\MarkdownExtra;
use Michelf\SmartyPants;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

/**
 * Turns a markdown resume into a self-contained HTML document.
 */
final class HtmlRenderer
{
    public function __construct(
        private readonly string $templatePath,
        private readonly string $defaultTemplate = 'modern',
        private readonly StyleCompiler $styles = new StyleCompiler(),
    ) {
    }

    public function render(string $source, ?string $template = null, ?int $refresh = null): string
    {
        if (!is_file($source)) {
            throw new \RuntimeException(\sprintf('Unable to open source file: %s', $source));
        }

        $templateDir = $this->resolveTemplateDirectory($template);

        if (!is_file($templateDir.'/index.html')) {
            throw new \RuntimeException(\sprintf('Unable to open template file: %s/index.html', $templateDir));
        }

        $resumeHtml = $this->markdownToHtml((string) file_get_contents($source));

        $twig = new Environment(new FilesystemLoader($templateDir), [
            'cache' => false,
            'autoescape' => 'html',
            'strict_variables' => false,
        ]);

        return $twig->render('index.html', [
            'title' => $this->extractTitle($resumeHtml),
            'style' => $this->styles->compileDirectory($templateDir.'/css'),
            'links' => $this->styles->concatDirectory($templateDir.'/links'),
            'resume' => $resumeHtml,
            'reload' => null !== $refresh && $refresh > 0,
            'refresh_rate' => $refresh,
        ]);
    }

    public function markdownToHtml(string $markdown): string
    {
        // Markdown Extra gives us definition lists and header ids; SmartyPants cleans up punctuation.
        return SmartyPants::defaultTransform(MarkdownExtra::defaultTransform($markdown));
    }

    public function resolveTemplateDirectory(?string $template): string
    {
        $template = null === $template || '' === $template ? $this->defaultTemplate : $template;

        if (str_contains($template, \DIRECTORY_SEPARATOR)) {
            $resolved = realpath($template);

            if (false === $resolved) {
                throw new \RuntimeException(\sprintf('Unable to find template directory: %s', $template));
            }

            return $resolved;
        }

        return $this->templatePath.\DIRECTORY_SEPARATOR.basename($template);
    }

    /**
     * Builds the document title from the first h1 and h2 in the rendered resume.
     */
    private function extractTitle(string $html): string
    {
        $previous = libxml_use_internal_errors(true);

        $dom = new \DOMDocument();
        $dom->loadHTML('<?xml encoding="utf-8"?><div>'.$html.'</div>');

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $parts = [];

        foreach (['h1', 'h2'] as $tag) {
            $node = $dom->getElementsByTagName($tag)->item(0);

            if (null !== $node) {
                $parts[] = trim($node->textContent);
            }
        }

        return implode(' | ', $parts);
    }
}
