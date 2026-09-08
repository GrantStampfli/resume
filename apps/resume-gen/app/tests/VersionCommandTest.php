<?php

declare(strict_types=1);

namespace Resume\Tests;

use Resume\Cli\Resume;

final class VersionCommandTest extends ResumeTestCase
{
    public function testItPrintsTheApplicationVersion(): void
    {
        $tester = $this->runCommand('version');

        self::assertSame(Resume::VERSION, trim($tester->getDisplay()));
        self::assertSame(0, $tester->getStatusCode());
    }
}
