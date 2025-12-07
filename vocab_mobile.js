const prompt = document.querySelector("#prompt")
const answer = document.querySelector("#answer")
const lists = document.querySelector("#lists")
document.querySelector("#controls p").addEventListener("click", (e) => {
	e.stopPropagation()
	words = new Set()
	prompt.innerHTML = ""
	answer.innerHTML = ""
})
document.querySelector("body").addEventListener("click", () => {
	if (!cycling) {cycle()}
})

var words = new Set()
var cycling = false
data.forEach(i => {
	var p = document.createElement("p")
	p.innerHTML = i[0]
	p.addEventListener("click", () => {
		for (j = 1; j < i.length; j += 2) {words.add(`${i[j]}|${i[j+1]}`)}
		cycle()
	})
	lists.appendChild(p)
})

async function cycle() {
	cycling = true
	var _words = new Set(words)
	_words.delete(`${prompt.innerHTML}|${answer.innerHTML}`)
	_words = [..._words][Math.floor(_words.size*Math.random())].split("|")
	prompt.innerHTML = _words[0]
	answer.innerHTML = ""
	await new Promise(resolve => {
		setTimeout(() => {
			answer.innerHTML = _words[1]
			resolve()
		}, 2000)
	})
	cycling = false
}

