<?php

declare(strict_types=1);

namespace Resume\Cli;

final class TwigFormatters
{
    public static function strpad(string $string, int $length, string $position = 'center'): string
    {
        $padding = match ($position) {
            'left' => \STR_PAD_RIGHT,
            'right' => \STR_PAD_LEFT,
            default => \STR_PAD_BOTH,
        };

        // Console markup such as <info>title</info> must not count towards the width.
        $totalLength = mb_strlen($string);
        $strippedLength = mb_strlen(strip_tags($string));
        $length += $totalLength - $strippedLength;

        return str_pad(mb_substr($string, 0, $length), $length, ' ', $padding);
    }

    public static function style(string $string, string $format): string
    {
        return \sprintf('<%2$s>%1$s</%2$s>', $string, $format);
    }
}
