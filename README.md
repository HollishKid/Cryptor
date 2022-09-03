[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Cryptor

## Drawbacks

- Execution time may be very long.
- The file size can substantially increase.

## TODO

- Make .key file a stringified JSON file.
This file will then allow to specify a program version to ensure (retro)compatibility.
- Progress bar.
- Check wether input !== output directory.
- Make sure output contained in input directory does not get double encrypted (i.e. do not encrypt files that are have .crypted extension).
- Display input and output directories.
- Display errors as they occur (e.g. "Directory not empty"), with possibility to translate.
- Add a confirm button ("Are you sure?")