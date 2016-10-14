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
//[Require("Xcode.Framework", "@('SystemConfiguration.framework'")]
//[ForeignInclude(Language.ObjC, "Reachability/Reachability.h")]
//[ForeignInclude(Language.ObjC, "Reachability/Reachability.m")]

[UXGlobalModule]
public class CheckWifi : NativeModule
{
	static readonly CheckWifi _instance;

	public CheckWifi()
	{
		if(_instance != null) return;

		Resource.SetGlobalKey(_instance = this, "CheckWifi");

		AddMember(new NativeFunction("CheckWifiJS", (NativeCallback)CheckWifiJS));
	}

	public static object CheckWifiJS(Context c, object[] args)
	{
		Checking();
		return null;
	}

	[Foreign(Language.Java)]
	public static extern(Android) void Checking()
	@{
		boolean isWifiConnect = manager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).isConnectedOrConnecting();
		debug_log(isWifiConnect);
	@}

	[Foreign(Language.ObjC)]
	public static extern(iOS) void Checking()
	@{
		int result = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
		if(result == 1) {
			debug_log(true);
		}
	@}

	extern(!mobile)
	public static void Checking()
	{
		debug_log "This is not mobile";
	}
}