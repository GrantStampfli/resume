<?php

declare(strict_types=1);

namespace Resume\Renderer;

/**
 * Compiles a template's css/ directory (LESS or plain CSS) into one stylesheet so the
 * resume can be shipped as a single file.
 */
final class StyleCompiler
{
    public function compileDirectory(string $directory): string
    {
        $files = $this->files($directory);

        if ([] === $files) {
            return '';
        }

        // Files are concatenated (alphabetically) before parsing so variables and mixins
        // declared in one file are available to the files that follow it.
        $parser = new \Less_Parser(['compress' => false]);

        foreach ($files as $file) {
            $parser->parse((string) file_get_contents($file), $file);
        }

        try {
            return trim($parser->getCss());
        } catch (\Less_Exception_Parser $exception) {
            throw new \RuntimeException(\sprintf('Unable to compile stylesheets in %s: %s', $directory, $exception->getMessage()), 0, $exception);
        }
    }

    public function concatDirectory(string $directory): string
    {
        $output = [];

        foreach ($this->files($directory) as $file) {
            $output[] = trim((string) file_get_contents($file));
        }

        return implode("\n", $output);
    }

    /**
     * @return list<string>
     */
    private function files(string $directory): array
    {
        if (!is_dir($directory)) {
            return [];
        }

        $files = [];

        foreach (new \DirectoryIterator($directory) as $fileInfo) {
            if ($fileInfo->isDot() || !$fileInfo->isFile()) {
                continue;
            }

            $files[] = $fileInfo->getPathname();
        }

        sort($files, \SORT_STRING);

        return $files;
    }
}
