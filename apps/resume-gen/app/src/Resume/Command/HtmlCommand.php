<?php

declare(strict_types=1);

namespace Resume\Command;

use Resume\Renderer\HtmlRenderer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'html', description: 'Generate an HTML resume from a markdown file')]
class HtmlCommand extends ResumeCommand
{
    protected function configure(): void
    {
        $this
            ->addArgument('source', InputArgument::REQUIRED, 'Source markdown document')
            ->addArgument('destination', InputArgument::REQUIRED, 'Output destination folder')
            ->addOption(
                'template',
                't',
                InputOption::VALUE_REQUIRED,
                'Which of the templates to use. Use an absolute path for a custom template.',
            )
            ->addOption(
                'refresh',
                'r',
                InputOption::VALUE_REQUIRED,
                'Include a meta tag that reloads the document periodically. Measured in seconds.',
            )
            ->addOption('output', 'o', InputOption::VALUE_REQUIRED, 'Override the output filename (without extension)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $source = (string) $input->getArgument('source');
        $destination = $this->destinationDirectory($input);
        $template = $input->getOption('template');
        $refresh = $input->getOption('refresh');

        $rendered = $this->renderer()->render(
            $source,
            \is_string($template) ? $template : null,
            \is_string($refresh) && '' !== $refresh ? (int) $refresh : null,
        );

        $destFilename = $this->destinationFile($input, $source, $destination, 'html');
        file_put_contents($destFilename, $rendered);

        $output->writeln(\sprintf('Wrote resume to: <info>%s</info>', $destFilename));

        return Command::SUCCESS;
    }

    protected function renderer(): HtmlRenderer
    {
        $resume = $this->resume();

        return new HtmlRenderer($resume->getTemplatePath(), $resume::DEFAULT_TEMPLATE);
    }

    protected function destinationDirectory(InputInterface $input): string
    {
        $destination = rtrim((string) $input->getArgument('destination'), \DIRECTORY_SEPARATOR);

        if ('' === $destination) {
            $destination = '.';
        }

        if (!is_dir($destination) && !mkdir($destination, 0o777, true) && !is_dir($destination)) {
            throw new \RuntimeException(\sprintf('Unable to create destination directory: %s', $destination));
        }

        return $destination;
    }

    protected function destinationFile(InputInterface $input, string $source, string $destination, string $extension): string
    {
        $override = $input->getOption('output');
        $basename = \is_string($override) && '' !== $override ? $override : pathinfo($source, \PATHINFO_FILENAME);

        return $destination.\DIRECTORY_SEPARATOR.$basename.'.'.$extension;
    }
}
