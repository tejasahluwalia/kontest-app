import { createRootRoute, Link, Outlet } from '@tanstack/solid-router'
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from "@kobalte/core"
import { createRootRouteWithContext } from '@tanstack/solid-router'
import { authClient } from '@client/lib/auth-client'

interface RootContext {
    // auth: ReturnType<typeof authClient.useSession>
}

export const Route = createRootRouteWithContext<RootContext>()({
    component: Root
})

function Root() {
    const storageManager = createLocalStorageManager("vite-ui-theme")

    return (
        <>
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
                <Outlet />
            </ColorModeProvider>
        </>
    )
}