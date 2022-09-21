// Command: !help
// V2
//§c<-=-=- §3§lCategory§r  §r§c-=-=->
// §6§o!help §r§fdescription
// V1
//export const helpCategory = "§r§l§6<-=-=-=- §d§l$CategoryName §r§6§l-=-=-=->";
//export const helpCommand = "§r§l!§r§l§a$CommandName §r§7$Description";
//export const helpCommandAdminOnly = "§r§l!§r§b§l$CommandName §r§7$Description";

// Commands
export const helpCategory = "§8§l[§r§7+§8§l] §r§d§l$CategoryName";
export const helpCommand = "  §8$Prefix§r§a$CommandName §7§r§7$Description $Aliases";

export const helpCategorySkinned =
    "$colorHeader1░░░░░$colorHeader2§l$CategoryName§r§r$colorHeader1░░░░░";
export const helpCommandSkinned =
    "$key§o$Prefix$CommandName §r$val$Description $Aliases";
export const keyValText = "§6§o$Key §r§f$Val";
export const basicText = "§r§f$Text";
export const detailedFont = "§¥";
export const prefix = "\\"; // might become legacy soon.
export const helpCommandAdminOnly = "§r§l!§r§b§l$CommandName §r§7$Description";
export const header1 = `§c<= §3§l$HEADERTEXT §r§c=>`;
// Characters
// ░▒▓

//─│┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬

// ╔═══ Category ═══╗
// ____
//    |
// ___|

// ▓▓▒▒▒░░░░

// ░░░░▒▒▒▓▓
export const charShade1 = "░";
export const charShade2 = "▒";
export const charShade3 = "▓;";
export const charCheck = "√";
export const doubleArrowGroup = "«»";
export const doubleArrowLeft = "«";
export const doubleArrowRight = "»";
export const uncensoredCharacters = "≡±≥".split(" ");
// Debug
export const testSuccess = `§a√ $TestName succeeded`;
export const testFailed = `§cX $TestName failed`;
// Input
export const equalsOperator = ["is", "==", "==="];
// Warps
export const warpToggledDisable = "§cDisabled warp: $warp";
export const warpToggledEnable = "§aEnabled warp: $warp";
export const warpAdded = "§aAdded warp at §d$x§7, §d$y§7, §d$z";
export const warpDoesNotExist = "§c404, Warp not Found";
export const cannotRemoveWarpError1 =
    "§cCannot remove warp as it does not exist.";
export const cannotSetWarpError1 =
    "§cYou cannot set a warp with a restricted name. Please try another.";
// Updates
export const azaleaOutdated =
    "§cYour version is outdated. Right now as of this version, there is no way to check if theres a newer version but there should be a new version after a month. Disable this with !azalea-automsg disable outdated";
export const azaleaOutdatedYear =
    "§cYour version of azalea is a year old! Please upgrade and if there has been a long wait for an update, please contact a developer. You can go ahead and disable this with !azalea-automsg disable outdaded";
export const azaleaUpgraded =
    "§dWelcome to azalea v$VersionMajor.$VersionMinor.$VersionMicro.$VersionBeta! Use !changelog to see what has been added!";
// API
export const basicOnOffToggleTextOn = "§aEnabled $ToggleName";
export const basicOnOffToggleTextOff = "§cDisabled $ToggleName";
// Credits
export const creditsYoutubeChannelAdministrators = ["ComicalDino", "TRASH"];
// Toggle Effects
export const adminsOnlyToggleEffectDialogCantUseAnAdminOnlyServerPleaseJoinAgainLater =
    "§cThis server is admins only at the moment. A common reason for this is that the server is being updated.";
// Punishment Dialog
export const mutedPunishmentDialog =
    "§cYou cannot talk while you are muted. Please contact an admin if you think this is an error.";
export const youHaveBeenWarned = "§6You have been warned by an admin.";
// Debug
export const testDialog =
    "This is test dialog from the debug command! This is used for azalea multicommand syntax.";
export const advancedInformation =
    "<Basic>\nVersion: V0.3.0.3.7\nVersion Type: Testing Beta\n<Advanced Details>\nAzalea API Version: V0.2\n<Storage>\n§aThe wise data fish √\n§r§aROT V2.X Azalea Variation √\n";

export const more = {};
