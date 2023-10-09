const ratio = .6
const  spies = document.querySelectorAll('[data-spy]')

let observer = null

/**
* @param {HTMLElement} element
 */

const activate = function (element) {
    const id = element.getAttribute('id')
    const anchor = document.querySelector(`a[href="#${id}"]`)
    if (anchor === null) {
        return null
    }
    anchor.parentElement
        .querySelectorAll('.active')
        .forEach(node => node.classList.remove('active'))
    anchor.classList.add('active')
}

/**
 * @param {IntersectionObserverEntry[]} entries
 */

const callblack = function (entries ) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
           activate(entry.target)
        }
    })
}

/**
 * @param {NodeListOf.<HTMLElement>} elements
 */
const observe = function (elements){
    if (observer !== null) {
        elements.forEach(element => observer.unobserve(element))
    }
    const y = Math.round(window.innerHeight * ratio)
    observer = new IntersectionObserver(callblack, {
        rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`
    })
    spies.forEach(element => observer.observe(element))
}

/**
 * @param {Function} callback
 * @param {number} delay
 * @return {Function}
 */
const debounce = function (callback, delay){
    let timer;
    return function(){
        let args = arguments;
        let context = this;
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay)
    }
}

if ( spies.length > 0) {
    observe(spies)
    let windowH = window.innerHeight
    window.addEventListener('resize', debounce(function () {
        observe(spies)
        windowH = window.innerHeight
    }, 500))
}