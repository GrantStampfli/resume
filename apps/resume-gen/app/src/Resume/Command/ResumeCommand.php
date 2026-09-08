<?php

declare(strict_types=1);

namespace Resume\Command;

use Resume\Cli\Resume;
use Symfony\Component\Console\Command\Command;

abstract class ResumeCommand extends Command
{
    protected function resume(): Resume
    {
        $application = $this->getApplication();

        if (!$application instanceof Resume) {
            throw new \LogicException(\sprintf('%s must be attached to a %s application.', static::class, Resume::class));
        }

        return $application;
    }
}
