// tslint:disable-next-line: max-line-length
export const operatorRx =
/([\w.']+\.)?\(?([\u{21}\u{23}-\u{26}\u{2A}-\u{2B}\u{2D}-\u{2F}\u{3A}\u{3C}-\u{40}\u{5C}\u{5E}\u{7C}\u{7E}\u{A1}-\u{A9}\u{AB}-\u{AC}\u{AE}-\u{B1}\u{B4}\u{B6}-\u{B8}\u{BB}\u{BF}\u{D7}\u{F7}\u{2C2}-\u{2C5}\u{2D2}-\u{2DF}\u{2E5}-\u{2EB}\u{2ED}\u{2EF}-\u{2FF}\u{375}\u{37E}\u{384}-\u{385}\u{387}\u{3F6}\u{482}\u{55A}-\u{55F}\u{589}-\u{58A}\u{58D}-\u{58F}\u{5BE}\u{5C0}\u{5C3}\u{5C6}\u{5F3}-\u{5F4}\u{606}-\u{60F}\u{61B}\u{61E}-\u{61F}\u{66A}-\u{66D}\u{6D4}\u{6DE}\u{6E9}\u{6FD}-\u{6FE}\u{700}-\u{70D}\u{7F6}-\u{7F9}\u{830}-\u{83E}\u{85E}\u{964}-\u{965}\u{970}\u{9F2}-\u{9F3}\u{9FA}-\u{9FB}\u{9FD}\u{AF0}-\u{AF1}\u{B70}\u{BF3}-\u{BFA}\u{C7F}\u{D4F}\u{D79}\u{DF4}\u{E3F}\u{E4F}\u{E5A}-\u{E5B}\u{F01}-\u{F17}\u{F1A}-\u{F1F}\u{F34}\u{F36}\u{F38}\u{F3A}-\u{F3D}\u{F85}\u{FBE}-\u{FC5}\u{FC7}-\u{FCC}\u{FCE}-\u{FDA}\u{104A}-\u{104F}\u{109E}-\u{109F}\u{10FB}\u{1360}-\u{1368}\u{1390}-\u{1399}\u{1400}\u{166D}-\u{166E}\u{169B}-\u{169C}\u{16EB}-\u{16ED}\u{1735}-\u{1736}\u{17D4}-\u{17D6}\u{17D8}-\u{17DB}\u{1800}-\u{180A}\u{1940}\u{1944}-\u{1945}\u{19DE}-\u{19FF}\u{1A1E}-\u{1A1F}\u{1AA0}-\u{1AA6}\u{1AA8}-\u{1AAD}\u{1B5A}-\u{1B6A}\u{1B74}-\u{1B7C}\u{1BFC}-\u{1BFF}\u{1C3B}-\u{1C3F}\u{1C7E}-\u{1C7F}\u{1CC0}-\u{1CC7}\u{1CD3}\u{1FBD}\u{1FBF}-\u{1FC1}\u{1FCD}-\u{1FCF}\u{1FDD}-\u{1FDF}\u{1FED}-\u{1FEF}\u{1FFD}-\u{1FFE}\u{2010}-\u{2027}\u{2030}-\u{205E}\u{207A}-\u{207E}\u{208A}-\u{208E}\u{20A0}-\u{20BF}\u{2100}-\u{2101}\u{2103}-\u{2106}\u{2108}-\u{2109}\u{2114}\u{2116}-\u{2118}\u{211E}-\u{2123}\u{2125}\u{2127}\u{2129}\u{212E}\u{213A}-\u{213B}\u{2140}-\u{2144}\u{214A}-\u{214D}\u{214F}\u{218A}-\u{218B}\u{2190}-\u{2426}\u{2440}-\u{244A}\u{249C}-\u{24E9}\u{2500}-\u{2775}\u{2794}-\u{2B73}\u{2B76}-\u{2B95}\u{2B98}-\u{2BB9}\u{2BBD}-\u{2BC8}\u{2BCA}-\u{2BD2}\u{2BEC}-\u{2BEF}\u{2CE5}-\u{2CEA}\u{2CF9}-\u{2CFC}\u{2CFE}-\u{2CFF}\u{2D70}\u{2E00}-\u{2E2E}\u{2E30}-\u{2E49}\u{2E80}-\u{2E99}\u{2E9B}-\u{2EF3}\u{2F00}-\u{2FD5}\u{2FF0}-\u{2FFB}\u{3001}-\u{3004}\u{3008}-\u{3020}\u{3030}\u{3036}-\u{3037}\u{303D}-\u{303F}\u{309B}-\u{309C}\u{30A0}\u{30FB}\u{3190}-\u{3191}\u{3196}-\u{319F}\u{31C0}-\u{31E3}\u{3200}-\u{321E}\u{322A}-\u{3247}\u{3250}\u{3260}-\u{327F}\u{328A}-\u{32B0}\u{32C0}-\u{32FE}\u{3300}-\u{33FF}\u{4DC0}-\u{4DFF}\u{A490}-\u{A4C6}\u{A4FE}-\u{A4FF}\u{A60D}-\u{A60F}\u{A673}\u{A67E}\u{A6F2}-\u{A6F7}\u{A700}-\u{A716}\u{A720}-\u{A721}\u{A789}-\u{A78A}\u{A828}-\u{A82B}\u{A836}-\u{A839}\u{A874}-\u{A877}\u{A8CE}-\u{A8CF}\u{A8F8}-\u{A8FA}\u{A8FC}\u{A92E}-\u{A92F}\u{A95F}\u{A9C1}-\u{A9CD}\u{A9DE}-\u{A9DF}\u{AA5C}-\u{AA5F}\u{AA77}-\u{AA79}\u{AADE}-\u{AADF}\u{AAF0}-\u{AAF1}\u{AB5B}\u{ABEB}\u{FB29}\u{FBB2}-\u{FBC1}\u{FD3E}-\u{FD3F}\u{FDFC}-\u{FDFD}\u{FE10}-\u{FE19}\u{FE30}-\u{FE52}\u{FE54}-\u{FE66}\u{FE68}-\u{FE6B}\u{FF01}-\u{FF0F}\u{FF1A}-\u{FF20}\u{FF3B}-\u{FF40}\u{FF5B}-\u{FF65}\u{FFE0}-\u{FFE6}\u{FFE8}-\u{FFEE}\u{FFFC}-\u{FFFD}\u{10100}-\u{10102}\u{10137}-\u{1013F}\u{10179}-\u{10189}\u{1018C}-\u{1018E}\u{10190}-\u{1019B}\u{101A0}\u{101D0}-\u{101FC}\u{1039F}\u{103D0}\u{1056F}\u{10857}\u{10877}-\u{10878}\u{1091F}\u{1093F}\u{10A50}-\u{10A58}\u{10A7F}\u{10AC8}\u{10AF0}-\u{10AF6}\u{10B39}-\u{10B3F}\u{10B99}-\u{10B9C}\u{11047}-\u{1104D}\u{110BB}-\u{110BC}\u{110BE}-\u{110C1}\u{11140}-\u{11143}\u{11174}-\u{11175}\u{111C5}-\u{111C9}\u{111CD}\u{111DB}\u{111DD}-\u{111DF}\u{11238}-\u{1123D}\u{112A9}\u{1144B}-\u{1144F}\u{1145B}\u{1145D}\u{114C6}\u{115C1}-\u{115D7}\u{11641}-\u{11643}\u{11660}-\u{1166C}\u{1173C}-\u{1173F}\u{11A3F}-\u{11A46}\u{11A9A}-\u{11A9C}\u{11A9E}-\u{11AA2}\u{11C41}-\u{11C45}\u{11C70}-\u{11C71}\u{12470}-\u{12474}\u{16A6E}-\u{16A6F}\u{16AF5}\u{16B37}-\u{16B3F}\u{16B44}-\u{16B45}\u{1BC9C}\u{1BC9F}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D164}\u{1D16A}-\u{1D16C}\u{1D183}-\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D200}-\u{1D241}\u{1D245}\u{1D300}-\u{1D356}\u{1D6C1}\u{1D6DB}\u{1D6FB}\u{1D715}\u{1D735}\u{1D74F}\u{1D76F}\u{1D789}\u{1D7A9}\u{1D7C3}\u{1D800}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1E95E}-\u{1E95F}\u{1EEF0}-\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F16B}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}-\u{1F251}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D4}\u{1F6E0}-\u{1F6EC}\u{1F6F0}-\u{1F6F8}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D4}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F900}-\u{1F90B}\u{1F910}-\u{1F93E}\u{1F940}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}]+)\)?$/u
