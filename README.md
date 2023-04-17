# Codebreaker.xyz scraper
For keeping track of who did what question on codebreaker.

### Disclaimer:
~~Not entirely accurate as it only looks at the latest 25 submissions made by a person for a problem.~~
Only applies to PS now.

## Usage
Clone the repo first and install the dependencies:
```bash
git clone https://github.com/DET171/cbr-scraper.git
cd cbr-scraper && yarn install
```

Then, run the script:
```bash
node . -u acertainsomeone geometric -p GSS helloworld2 beareatrabbit guessproblem3
```

## Options
```
Options:
      --version    Show version number                                 [boolean]
  -u, --usernames  List of usernames to fetch                 [array] [required]
  -p, --problems   List of problems to fetch                  [array] [required]
  -o, --output     Output format
                   [string] [choices: "stdout", "md", "csv"] [default: "stdout"]
      --help       Show help                                           [boolean]
```