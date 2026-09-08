<?php

declare(strict_types=1);

namespace Resume\Tests;

use PHPUnit\Framework\TestCase;
use Resume\Cli\Resume;
use Symfony\Component\Console\Tester\CommandTester;

abstract class ResumeTestCase extends TestCase
{
    protected Resume $console;

    protected function setUp(): void
    {
        $templatePath = realpath(__DIR__.'/../templates');
        self::assertNotFalse($templatePath);

        $this->console = new Resume($templatePath);
        $this->console->setAutoExit(false);
    }

    /**
     * @param array<string, mixed> $input
     */
    protected function runCommand(string $name, array $input = []): CommandTester
    {
        $command = $this->console->find($name);
        $tester = new CommandTester($command);
        $tester->execute(['command' => $command->getName()] + $input);

        return $tester;
    }

    protected static function fixture(string $name): string
    {
        return __DIR__.'/fixtures/'.$name;
    }

    protected function tempDirectory(): string
    {
        $dir = sys_get_temp_dir().'/resume-gen-'.bin2hex(random_bytes(4));
        mkdir($dir, 0o777, true);

        return $dir;
    }

    protected function removeDirectory(string $dir): void
    {
        foreach (glob($dir.'/{,.}*', \GLOB_BRACE) ?: [] as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        @rmdir($dir);
    }
}
