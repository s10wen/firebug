/* See license.txt for terms of usage */

try {

(function() {
// ********************************************************************************************* //

var config = Firebug.getModuleLoaderConfig();

if (FBTrace.DBG_INITIALIZE || FBTrace.DBG_MODULES)
{
    if (FBTrace.DBG_MODULES)
        config.debug = true;

    FBTrace.sysout("main.js; Loading Firebug modules...", config);
    var startLoading = new Date().getTime();
}

var modules = [
    "firebug/chrome/chrome",
    "firebug/lib/lib",
    "firebug/firebug"
].concat(config.modules);

// ********************************************************************************************* //

require(config, modules, function(ChromeFactory, FBL, Firebug)
{
    try
    {
        if (FBTrace.DBG_INITIALIZE || FBTrace.DBG_MODULES)
        {
            var delta = (new Date().getTime()) - startLoading;
            FBTrace.sysout("main.js; Firebug modules loaded using RequireJS in "+delta+" ms");
        }

        // Extensions also shouldn't use the global require since it should be removed
        // in the future (if possible). Global 'require' could collide with other
        // extensions.
        Firebug.require = require;

        Firebug.Options.initialize("extensions.firebug");
        window.panelBarWaiter.waitForPanelBar(ChromeFactory);

        if (window.legacyPatch)
        {
            FBTrace.sysout("firebug main.js; legacyPatch");
            window.legacyPatch(FBL, Firebug);
        }

        if (FBTrace.DBG_MODULES)
            require.analyzeDependencyTree();
    }
    catch(exc)
    {
        if (FBTrace)
            FBTrace.sysout("Firebug main initialization ERROR "+exc, exc);

        window.dump("Firebug main initialization ERROR "+exc+"\n");

        if (Components)
            Components.utils.reportError(exc);
    }
});

// ********************************************************************************************* //
})();

} catch (exc) {

    window.dump("Firebug main  ERROR "+exc+"\n");

    if (Components)
        Components.utils.reportError(exc);
}

// ********************************************************************************************* //
