# autocomplete-haskell atom package

Autocomplete-haskell uses [Ghc-Mod][4] to find auto-completions for Haskell source. It depends on [autocomplete-plus][1] and uses interface to ghc-mod provided by [haskell-ghc-mod][2].

If you also install [Hoogle][3], you can also show auto-completions for hole `_`. This will try to find replacements based on type. It's no magic though, so if hole has some crazy type, Hoogle won't find anything.

[1]: https://atom.io/packages/autocomplete-plus
[2]: https://atom.io/packages/haskell-ghc-mod
[3]: https://www.haskell.org/hoogle
[4]: http://www.mew.org/~kazu/proj/ghc-mod/en/

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
