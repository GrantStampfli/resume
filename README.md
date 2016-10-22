# Resume/CV Generator

- PDF generation via [wkhtmltopdf](https://github.com/pdfkit/pdfkit/wiki/Installing-WKHTMLTOPDF)
- Responsive design for multiple device viewport sizes
- Simple Markdown formatting
- Single file deployment (no external stylesheets)


## **Options and Help:**
```
Usage:
  [options] command [arguments]

Options:
  --help           -h Display this help message.
  --quiet          -q Do not output any message.
  --verbose        -v|vv|vvv Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
  --version        -V Display this application version.
  --ansi              Force ANSI output.
  --no-ansi           Disable ANSI output.
  --no-interaction -n Do not ask any interactive question.

Available commands:
  help         Displays help for a command
  html         Generate an HTML resume from a markdown file
  list         Lists commands
  pdf          Generate a PDF from a markdown file
  selfupdate   Updates resume.phar to the latest version.
  stats        Generate a word frequency analysis of your resume
  templates    List available templates
  version      Show current version information
```
> ###_**Templates to choose from:**_
**modern, swissen, blockish, readable, and unstyled**.

> ##Output Options:
To generate the **resume.md** to a html and or pdf format follow the steps below. Each of the examples below is a different **template** output. 

1. 
```
cd/app/
./bin/resume html --template modern ../resume.md ../
./bin/resume pdf --template modern ../resume.md ../
```
2.
```
cd/app/
./bin/resume html --template swissen ../resume.md ../
./bin/resume pdf --template swissen ../resume.md ../
```
3.
```
cd/app/
./bin/resume html --template blockish ../resume.md ../
./bin/resume pdf --template blockish ../resume.md ../
```
4.
```
cd/app/
./bin/resume html --template readable ../resume.md ../
./bin/resume pdf --template readable ../resume.md ../
```
5.
```
cd/app/
./bin/resume html --template unstyled ../resume.md ../
./bin/resume pdf --template unstyled ../resume.md ../
```

> ####ACKNOWLEDGMENTS:
* The main template style for this app was borrowed from the **[Sample Resume Template](http://sampleresumetemplate.net/ "A great starting point")**.
* The Markdown conversion tool was created by: **[Craig Davis](https://github.com/there4 "Author of the Markdown Generator")**
* The command line tool for PDF generations ([wkhtmltopdf](https://github.com/pdfkit/pdfkit/wiki/Installing-WKHTMLTOPDF ".md to .pdf")) was created by: **[Ashish Kulkarni](https://github.com/ashkulz "Author of the WKHTMLTOPDF commandline tool.")**
___
