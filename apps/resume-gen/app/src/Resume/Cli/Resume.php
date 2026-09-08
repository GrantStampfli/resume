<?php

declare(strict_types=1);

namespace Resume\Cli;

use Resume\Command\HtmlCommand;
use Resume\Command\PdfCommand;
use Resume\Command\StatsCommand;
use Resume\Command\TemplatesCommand;
use Resume\Command\VersionCommand;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\TwigFilter;

final class Resume extends Application
{
    public const NAME = 'Markdown Resume Generator';
    public const VERSION = '3.0.0';
    public const DEFAULT_TEMPLATE = 'modern';

    private readonly Environment $consoleTwig;

    public function __construct(
        private readonly string $templatePath,
        ?string $consoleTemplatePath = null,
    ) {
        parent::__construct(self::NAME, self::VERSION);

        $this->consoleTwig = new Environment(
            new FilesystemLoader($consoleTemplatePath ?? __DIR__.'/../Console'),
            [
                'cache' => false,
                'autoescape' => false,
                'strict_variables' => true,
            ],
        );

        // Helpers used to pad and style console output inside the twig views.
        $this->consoleTwig->addFilter(new TwigFilter('pad', TwigFormatters::strpad(...)));
        $this->consoleTwig->addFilter(new TwigFilter('style', TwigFormatters::style(...)));
        $this->consoleTwig->addFilter(new TwigFilter('repeat', str_repeat(...)));
        $this->consoleTwig->addFilter(new TwigFilter('wrap', wordwrap(...)));

        $this->addCommands([
            new HtmlCommand(),
            new PdfCommand(),
            new StatsCommand(),
            new TemplatesCommand(),
            new VersionCommand(),
        ]);
    }

    public function getTemplatePath(): string
    {
        return $this->templatePath;
    }

    public function getConsoleTwig(): Environment
    {
        return $this->consoleTwig;
    }

    public function getLongVersion(): string
    {
        return parent::getLongVersion().' by <comment>Grant Stampfli</comment>';
    }

    protected function configureIO(InputInterface $input, OutputInterface $output): void
    {
        parent::configureIO($input, $output);

        $formatter = $output->getFormatter();
        $formatter->setStyle('fire', new OutputFormatterStyle('red', 'yellow', ['bold']));
        $formatter->setStyle('notice', new OutputFormatterStyle('blue'));
        $formatter->setStyle('alert', new OutputFormatterStyle('red', null, ['bold']));
        $formatter->setStyle('bold', new OutputFormatterStyle(null, null, ['bold']));
        $formatter->setStyle('heading', new OutputFormatterStyle('black', 'white'));
        $formatter->setStyle('logo', new OutputFormatterStyle('blue', null, ['bold']));
    }
}
