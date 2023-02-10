const maxLines = 10

const css = `
  .tweetless-collapsed {
    display: -webkit-box;
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

function getLines(el) {
	const styles = window.getComputedStyle(el)
	const lineHeight = parseInt(styles.lineHeight)
	const elementHeight = el.offsetHeight
	const numberOfLines = Math.round(elementHeight / lineHeight)
	return numberOfLines
}

const style = document.createElement('style')
style.innerHTML = css
document.head.appendChild(style)

const targetNode = document.body

const config = { childList: true, subtree: true }

function onMutation(mutationsList) {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			const tweetTextElements = [...document.querySelectorAll('[data-testid="tweetText"]')]

			tweetTextElements.forEach((el) => {
				if (!el.classList.contains('tweetless')) {
					el.classList.add('tweetless-collapsed')
				}
				if (getLines(el) >= maxLines && !el.parentElement.lastElementChild.matches('button')) {
					const btn = document.createElement('button')
					btn.style =
						'appearance: none; background: none; border: none; align-self: flex-start; margin-top: 4px; color: var(--accent-color, #1d9bf0); cursor: pointer; font-size: inherit; font-weight: 400; line-height:20px; margin: 0; padding: 0;'
					btn.innerHTML = 'Expand'

					btn.addEventListener('click', () => {
						if (el.classList.contains('tweetless-collapsed')) {
							el.classList.remove('tweetless-collapsed')
							el.classList.add('tweetless')
							btn.innerHTML = 'Collapse'
						} else {
							el.classList.add('tweetless-collapsed')
							el.classList.remove('tweetless')
							btn.innerHTML = 'Expand'
						}
					})

					el.parentElement.appendChild(btn)
				}
			})
		}
	}
}

const observer = new MutationObserver(onMutation)

observer.observe(targetNode, config)
