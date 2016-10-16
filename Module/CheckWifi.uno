using Uno;
using Uno.UX;
using Uno.Threading;
using Uno.Text;
using Uno.Platform;
using Uno.Compiler.ExportTargetInterop;
using Uno.Collections;
using Fuse;
using Fuse.Scripting;
using Fuse.Reactive;
[Require("Xcode.FrameworkDirectory", "@('Reachability':Path)")]
[Require("Xcode.Framework", "@('Reachability/SystemConfiguration.framework':Path)")]
[ForeignInclude(Language.ObjC, "Reachability/Reachability.h")]
[ForeignInclude(Language.ObjC, "Reachability/Reachability.m")]

[UXGlobalModule]
public class CheckWifi : NativeModule
{
	static readonly CheckWifi _instance;

	public CheckWifi()
	{
		if(_instance != null) return;

		Resource.SetGlobalKey(_instance = this, "CheckWifi");

		AddMember(new NativePromise<string, Fuse.Scripting.Object>("CheckWifi", CheckWifiJS, Converter));
	}

	static string CheckWifiJS(object[] args)
	{
		return Checking();
	}

	static Fuse.Scripting.Object Converter(Context context, string str)
	{
		var wrapperObject = context.NewObject();
		wrapperObject["result"] = str;
		return wrapperObject;
	}

	[Foreign(Language.Java)]
	public static extern(Android) string Checking()
	@{
		boolean isWifiConnect = manager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).isConnectedOrConnecting();
		if (android.util.Log.d(isWifiConnect)) {
			return "1";
		} else {
			return "0";
		}
	@}

	[Foreign(Language.ObjC)]
	public static extern(iOS) string Checking()
	@{
		int result = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
		if(result == 1) {
			return @"1";
		} else {
			return @"0";
		}
	@}

	extern(!mobile)
	public static string Checking()
	{
//		debug_log "This is not a mobile";
		return "1";
	}
}