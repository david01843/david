var clients = new Set()
Deno.serve((request) => {
	if (request.headers.get("upgrade") === "websocket") {
		const {socket, response} = Deno.upgradeWebSocket(request)
		clients.add(socket)
		socket.onopen = () => {
			socket.send(JSON.stringify({a: 1, b: "asdf"}))
		}
		socket.onmessage = (e) => {
			socket.send(JSON.stringify({a: 2, b: "asdf"}))
			for (const c of clients) {
				if (c !== socket && c.readyState == 1) {
					c.send(e.data)
				}
			}
		}
		socket.onclose = () => {clients.delete(socket)}
		socket.onerror = () => {clients.delete(socket)}
		return response
	}
})
