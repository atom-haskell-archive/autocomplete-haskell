# autocomplete-haskell atom package

Autocomplete-haskell provides autocompletion facilities for your Haskell
hacking.
It relies on scope names provided by [language-haskell][1] and `haskell-completion-backend` service, provided by [haskell-ghc-mod][2]

You can show auto-completions for hole `_`. This will try to find replacements
based on type. It's no magic though, so if hole has some crazy type, it won't
find anything.

Current autocompletion scopes:

* Import module name
* Import module symbols
* Language pragmas
* OPTIONS_GHC pragma
* Type name
* Class name
* Symbol name

Sadly, it does not pick up types and/or other symbols defined in current file
(ghc-mod seems to be incapable of this feat), so for this you have to rely on
default autocomplete-plus SymbolProvider.

## Dependencies

Atom packages:
* [language-haskell][1]
* [haskell-ghc-mod][2]

[1]: https://atom.io/packages/language-haskell
[2]: https://atom.io/packages/haskell-ghc-mod

![Screencast](https://raw.githubusercontent.com/lierdakil/autocomplete-haskell/master/screencast.gif)
