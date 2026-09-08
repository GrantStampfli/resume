<?php

declare(strict_types=1);

namespace Resume\Tests;

use PHPUnit\Framework\Attributes\DataProvider;

final class HtmlCommandTest extends ResumeTestCase
{
    private string $outputDir;

    protected function setUp(): void
    {
        parent::setUp();
        $this->outputDir = $this->tempDirectory();
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->outputDir);
    }

    public function testItRendersASingleFileHtmlDocument(): void
    {
        $tester = $this->runCommand('html', [
            'source' => self::fixture('sample.md'),
            'destination' => $this->outputDir,
        ]);

        self::assertSame(0, $tester->getStatusCode());
        self::assertStringContainsString('Wrote resume to:', $tester->getDisplay());

        $html = (string) file_get_contents($this->outputDir.'/sample.html');

        self::assertStringContainsString('<title>Jane Doe | Software Engineer</title>', $html);
        self::assertStringContainsString('<h1>Jane Doe</h1>', $html);
        self::assertStringContainsString('<h3 id="profile">Profile</h3>', $html);
        self::assertStringContainsString('<dt>Example Corp</dt>', $html);
        // SmartyPants turns straight quotes and dashes into typographic entities.
        self::assertStringContainsString('&#8220;ships&#8221;', $html);
        self::assertStringContainsString('&#8212;', $html);
        // The LESS in the template css directory is compiled and inlined.
        self::assertStringContainsString('<style type="text/css">', $html);
        self::assertStringContainsString('.clearfix:after', $html);
        self::assertStringNotContainsString('&:after', $html);
        self::assertStringNotContainsString('{{', $html);
    }

    public function testItSupportsOutputOverrideAndRefresh(): void
    {
        $this->runCommand('html', [
            'source' => self::fixture('sample.md'),
            'destination' => $this->outputDir,
            '--output' => 'index',
            '--refresh' => '5',
        ]);

        $html = (string) file_get_contents($this->outputDir.'/index.html');

        self::assertStringContainsString('<meta http-equiv="refresh" content="5">', $html);
    }

    #[DataProvider('templates')]
    public function testEveryBundledTemplateRenders(string $template): void
    {
        $tester = $this->runCommand('html', [
            'source' => self::fixture('sample.md'),
            'destination' => $this->outputDir,
            '--template' => $template,
        ]);

        self::assertSame(0, $tester->getStatusCode());
        self::assertFileExists($this->outputDir.'/sample.html');
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function templates(): iterable
    {
        foreach (['blockish', 'modern', 'readable', 'swissen', 'unstyled'] as $template) {
            yield $template => [$template];
        }
    }

    public function testItFailsForAMissingSource(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Unable to open source file');

        $this->runCommand('html', [
            'source' => self::fixture('missing.md'),
            'destination' => $this->outputDir,
        ]);
    }
}
