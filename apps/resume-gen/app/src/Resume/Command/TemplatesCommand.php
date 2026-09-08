<?php

declare(strict_types=1);

namespace Resume\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'templates', description: 'List available templates')]
final class TemplatesCommand extends ResumeCommand
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $resume = $this->resume();
        $templates = [];

        foreach (new \DirectoryIterator($resume->getTemplatePath()) as $fileInfo) {
            if ($fileInfo->isDot() || !$fileInfo->isDir()) {
                continue;
            }

            $descriptionPath = $fileInfo->getPathname().'/description.txt';
            $templates[$fileInfo->getBasename()] = [
                'name' => $fileInfo->getBasename(),
                'description' => is_file($descriptionPath)
                    ? trim((string) file_get_contents($descriptionPath))
                    : 'No description available',
            ];
        }

        ksort($templates);

        $view = $resume->getConsoleTwig()->render('templates.twig', ['templates' => array_values($templates)]);
        $output->write($view, true);

        return Command::SUCCESS;
    }
}
