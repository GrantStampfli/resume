<?php

declare(strict_types=1);

namespace Resume\Tests;

use PHPUnit\Framework\TestCase;
use Resume\Renderer\PdfRenderer;

final class PdfRendererTest extends TestCase
{
    public function testItAddsThePdfClassToAnExistingBodyClass(): void
    {
        $renderer = new PdfRenderer();

        self::assertSame(
            '<html><body class="resume pdf"><p>hi</p></body></html>',
            $renderer->markPdfBody('<html><body class="resume"><p>hi</p></body></html>'),
        );
    }

    public function testItAddsAClassAttributeWhenTheBodyHasNone(): void
    {
        $renderer = new PdfRenderer();

        self::assertSame('<body class="pdf">', $renderer->markPdfBody('<body>'));
        self::assertSame('<body class="pdf">', $renderer->markPdfBody('<body class="">'));
    }

    public function testItRendersAPdfWhenAnEngineIsAvailable(): void
    {
        $renderer = new PdfRenderer();

        if (null === $renderer->engine()) {
            self::markTestSkipped('No PDF engine (Chromium or wkhtmltopdf) installed.');
        }

        $destination = sys_get_temp_dir().'/resume-gen-'.bin2hex(random_bytes(4)).'.pdf';

        try {
            $renderer->render('<html><body><h1>Hello</h1></body></html>', $destination);

            self::assertFileExists($destination);
            self::assertStringStartsWith('%PDF', (string) file_get_contents($destination));
        } finally {
            @unlink($destination);
        }
    }
}
