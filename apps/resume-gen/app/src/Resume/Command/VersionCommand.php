<?php

declare(strict_types=1);

namespace Resume\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'version', description: 'Show current version information')]
final class VersionCommand extends ResumeCommand
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln($this->resume()->getVersion());

        return Command::SUCCESS;
    }
}
