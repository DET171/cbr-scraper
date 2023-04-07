# Codebreaker.xyz scraper
For keeping track of who did what question on codebreaker.

Only looks at the 25 latest submissions a person has made to a certain problem (e.g. if person A AC'ed a problem but decided to WA for the next 25 submissions for some reason, person A will not be counted as having AC'ed the problem).

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
                   - stdout
									 - json
									 - md
                   - csv                            [string] [default: "stdout"]
      --help       Show help                                           [boolean]
```