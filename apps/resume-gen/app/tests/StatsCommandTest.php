<?php

declare(strict_types=1);

namespace Resume\Tests;

final class StatsCommandTest extends ResumeTestCase
{
    public function testItPrintsAFrequencyAnalysis(): void
    {
        $tester = $this->runCommand('stats', ['source' => self::fixture('sample.md')]);

        self::assertSame(0, $tester->getStatusCode());
        self::assertStringContainsString('Word Frequency Analysis', $tester->getDisplay());
        self::assertStringContainsString('Single Words:', $tester->getDisplay());
    }
}
