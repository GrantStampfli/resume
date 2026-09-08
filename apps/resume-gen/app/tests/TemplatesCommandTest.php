<?php

declare(strict_types=1);

namespace Resume\Tests;

final class TemplatesCommandTest extends ResumeTestCase
{
    public function testItListsEveryBundledTemplate(): void
    {
        $display = $this->runCommand('templates')->getDisplay();

        self::assertStringContainsString('Available Templates', $display);

        foreach (['blockish', 'modern', 'readable', 'swissen', 'unstyled'] as $template) {
            self::assertStringContainsString($template, $display);
        }

        self::assertStringContainsString('Modern and clean layout (default)', $display);
    }
}
