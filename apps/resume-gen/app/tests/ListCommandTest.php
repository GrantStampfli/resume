<?php

declare(strict_types=1);

namespace Resume\Tests;

final class ListCommandTest extends ResumeTestCase
{
    public function testItListsTheAvailableCommands(): void
    {
        $display = $this->runCommand('list')->getDisplay();

        self::assertMatchesRegularExpression('/Available commands/', $display);
        self::assertMatchesRegularExpression('/Options/', $display);

        foreach (['html', 'pdf', 'stats', 'templates', 'version'] as $command) {
            self::assertStringContainsString($command, $display);
        }
    }
}
