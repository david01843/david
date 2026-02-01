var data = []
for (i in all_data) { // Object.keys(all_data)
	x = []
	x.push(i)
	for (j in all_data[i]) {
		k = all_data[i][parseInt(j)]
		x.push(k["0"]+(k["1sn"] || k["1ma"] || k["inf"] || ""))
		x.push(k["t"])
	}
	data.push(x)
}

const prompt = document.querySelector("#prompt")
const answer = document.querySelector("#answer")
const lists = document.querySelector("#lists")
const controls = document.querySelectorAll("#controls p")

const chars = "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю,"
const codes = [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
var active = null
var audio = new SpeechSynthesisUtterance()
audio.lang = "ru"
var focus = 5
data.forEach(i => {
	var p = document.createElement("p")
	p.innerHTML = i[0]
	p.addEventListener("click", () => {
		for (j = 1; j < i.length; j += 2) {addword(i[j], i[j+1])}
		shuffle()
		cycle()
	})
	lists.appendChild(p)
})

controls[0].addEventListener("click", () => {
	Array.from(document.querySelectorAll("#words p")).forEach(i => i.remove())
	cycle()
})
controls[1].addEventListener("click", () => {
	if (focus == 5) {focus = 3e3; controls[1].innerHTML = "focus (off)"}
	else {focus = 5; controls[1].innerHTML = "focus (on)"}
})
words = document.querySelector("#words")
function addword(s1, s2) {
	w = document.createElement("p")
	w.dataset.ans = s1 // answer
	w.innerHTML = s2 // prompt
	words.appendChild(w)
}
function shuffle() {
	const p = Array.from(words.querySelectorAll('p'))
	p.sort(() => Math.random()-.5)
	p.forEach(p => words.appendChild(p))
}
function check() {
	if (prompt.innerHTML != "") {
		if (answer.innerHTML == active.dataset.ans) {
			answer.style.color = "limegreen"
			speechSynthesis.speak(audio)
		} else if (answer.innerHTML != active.dataset.ans.slice(0, answer.innerHTML.length)) {
			answer.style.color = "red"
		} else {
			answer.style.color = "black"
		}
	}
}
function cycle() {
	active = Array.from(words.querySelectorAll("p")).slice(0, focus).filter(i => i != active)
	if (active.length != 0) {
		active = active[Math.floor(Math.random()*active.length)]
		prompt.innerHTML = active.innerHTML
		speechSynthesis.cancel()
		audio.text = active.dataset.ans
	} else {
		active = null
		prompt.innerHTML = ""
	}
	answer.innerHTML = ""
	answer.style.color = "black"
}
document.addEventListener("keydown", (e) => {
	if (codes.includes(e.keyCode)) {answer.innerHTML += chars[codes.indexOf(e.keyCode)]; check()}
	else if (e.keyCode == 8) {answer.innerHTML = answer.innerHTML.slice(0, -1); check()}
	else if (e.keyCode == 13) {
		if (!active) {cycle()}
		else if (answer.style.color == "limegreen") {
			if (e.shiftKey) {active.remove()}
			cycle()
		}
		else {answer.innerHTML = active.dataset.ans; check()}
	}
	else if (e.keyCode == 32) {answer.innerHTML += " "; check()}
})
