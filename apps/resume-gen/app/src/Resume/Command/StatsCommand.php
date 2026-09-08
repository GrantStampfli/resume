<?php

declare(strict_types=1);

namespace Resume\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'stats', description: 'Generate a word frequency analysis of your resume')]
final class StatsCommand extends ResumeCommand
{
    private const STOP_WORDS = [
        'the', 'of', 'and', 'to', 'a', 'in', 'that', 'it', 'is', 'was', 'i', 'for', 'on', 'you', 'he', 'be', 'with',
        'as', 'by', 'at', 'have', 'are', 'this', 'not', 'but', 'had', 'his', 'they', 'from', 'she', 'which', 'or',
        'we', 'an', 'there', 'her', 'were', 'one', 'do', 'been', 'all', 'their', 'has', 'would', 'will', 'what',
        'if', 'can', 'when', 'so', 'my',
    ];

    protected function configure(): void
    {
        $this->addArgument('source', InputArgument::REQUIRED, 'Source markdown document');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $source = (string) $input->getArgument('source');

        if (!is_file($source)) {
            throw new \RuntimeException(\sprintf('Unable to open source file: %s', $source));
        }

        $words = $this->tokenize((string) file_get_contents($source));

        $view = $this->resume()->getConsoleTwig()->render('frequency.twig', [
            'single' => $this->buildStats($words, 1),
            'double' => $this->buildStats($words, 2),
            'triple' => $this->buildStats($words, 3),
        ]);

        $output->write($view, true);

        return Command::SUCCESS;
    }

    /**
     * @return list<string>
     */
    private function tokenize(string $content): array
    {
        $content = (string) preg_replace('/(,|"|\.|\?|:|!|;|#|-|>|\{|\*| - )/', ' ', $content);
        $content = (string) preg_replace('/\s+/', ' ', $content);

        return array_values(array_filter(explode(' ', trim($content)), static fn (string $word): bool => '' !== $word));
    }

    /**
     * Counts every n-word phrase in the document, most frequent first.
     *
     * @param list<string> $words
     *
     * @return array<string, int>
     */
    private function buildStats(array $words, int $size): array
    {
        $results = [];
        $count = \count($words);

        for ($i = 0; $i + $size <= $count; ++$i) {
            $phrase = mb_strtolower(implode(' ', \array_slice($words, $i, $size)));
            $results[$phrase] = ($results[$phrase] ?? 0) + 1;
        }

        if (1 === $size) {
            foreach (self::STOP_WORDS as $banned) {
                unset($results[$banned]);
            }
        }

        arsort($results);

        return $results;
    }
}
