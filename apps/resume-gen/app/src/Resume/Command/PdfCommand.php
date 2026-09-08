<?php

declare(strict_types=1);

namespace Resume\Command;

use Resume\Renderer\PdfRenderer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'pdf', description: 'Generate a PDF from a markdown file')]
final class PdfCommand extends HtmlCommand
{
    protected function configure(): void
    {
        $this
            ->addArgument('source', InputArgument::REQUIRED, 'Source markdown document')
            ->addArgument('destination', InputArgument::REQUIRED, 'Output destination folder')
            ->addOption('template', 't', InputOption::VALUE_REQUIRED, 'Which of the templates to use')
            ->addOption('output', 'o', InputOption::VALUE_REQUIRED, 'Override the output filename (without extension)')
            ->addOption(
                'engine',
                null,
                InputOption::VALUE_REQUIRED,
                'PDF engine: "chromium" (default when available) or "wkhtmltopdf". Also read from RESUME_PDF_ENGINE.',
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $source = (string) $input->getArgument('source');
        $destination = $this->destinationDirectory($input);
        $template = $input->getOption('template');
        $engine = $input->getOption('engine');

        $pdfRenderer = new PdfRenderer(\is_string($engine) ? $engine : null);

        if (null === $pdfRenderer->engine()) {
            $output->writeln(
                "\n<error>Error:</error> No PDF engine found.\n".
                "  Install Chromium/Google Chrome (or set RESUME_CHROMIUM_PATH), or install wkhtmltopdf.\n",
            );

            return Command::FAILURE;
        }

        $html = $this->renderer()->render($source, \is_string($template) ? $template : null);
        $destFilename = $this->destinationFile($input, $source, $destination, 'pdf');

        $pdfRenderer->render($html, $destFilename);

        $output->writeln(\sprintf(
            'Wrote pdf resume to: <info>%s</info> (engine: <comment>%s</comment>)',
            $destFilename,
            $pdfRenderer->engine(),
        ));

        return Command::SUCCESS;
    }
}
