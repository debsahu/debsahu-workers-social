import links from "./links"
import {Router} from "itty-router"

class ProfileRewriter {
    element(element) {
        element.removeAttribute("style")
    }
}

class AvatarRewriter {
    element(element) {
        element.setAttribute("src", "https://github.com/debsahu.png")
    }
}

class NameRewriter {
    element(element) {
        element.setInnerContent("Debashish Sahu")
    }
}

class LinkRewriter {
    element(element) {
        links.forEach(link =>
            element.append(
               `<a href="${link.url}" target="_blank">${link.name}</a>`,
                {
                    html: true,
                },
            ),
        )
    }
}

const router = Router()

router.get("/links", () => {
    const response = new Response(JSON.stringify(links), {
        headers: {"content-type": "application/json"},
    })

    return response
})

router.get("*", async () => {
	const response = await fetch(
        "https://www.debashishsahu.com/linktree",
    )
    const rewrittenResponse = new HTMLRewriter()
        .on("#profile", new ProfileRewriter())
        .on("#avatar", new AvatarRewriter())
        .on("#name", new NameRewriter())
        .on("#links", new LinkRewriter())
        .transform(response)
    return rewrittenResponse
})

router.all("*", () => {
    const response = new Response(
        "Error: This service only accepts GET requests.",
        {
            status: 500,
            headers: {"content-type": "text/plain"},
        },
    )

    return response
})

addEventListener("fetch", event => {
    event.respondWith(router.handle(event.request))
})