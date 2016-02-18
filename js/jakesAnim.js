(function() {
    //https://jakearchibald.com/2014/offline-cookbook/

    function joinerAnim(pathContainer, startTime) {
        return Array.from(pathContainer.children).reduce(function (startTime, path) {
            var length = path.getTotalLength();
            var duration = Math.min(Math.max(length / 150, 0.1), 2);
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;

            setTimeout(function () {
                path.style.transition = 'stroke-dashoffset ' + duration + 's ease-in-out ' + startTime + 's';
                path.style.strokeDashoffset = '0';
            }, 100);

            return startTime + duration + 0.1;
        }, startTime);
    }

    function fadeInAnim(el, startTime) {
        var duration = 0.6;
        el.style.opacity = '0';

        setTimeout(function () {
            el.style.transition = 'opacity ' + duration + 's cubic-bezier(0.455, 0.030, 0.515, 0.955) ' + startTime + 's';
            el.style.opacity = '1';
        }, 100);

        return duration;
    }

    function doAnim(el, startTime) {
        var children = Array.from(el.children);
        var endTime = 0;

        var isSequence = el.classList.contains('sequence');

        children.forEach(function (child) {
            var animEnd;
            child.style.display = 'inline';

            if (child.classList.contains('joiner') || child.classList.contains('cross')) {
                animEnd = joinerAnim(child, startTime);
            }
            else if (child.classList.contains('fade-in')) {
                animEnd = fadeInAnim(child, startTime);
            }
            else if (child.classList.contains('anim')) {
                animEnd = doAnim(child, startTime);
            }

            animEnd += Number(el.getAttribute('data-time-padding')) || 0;

            if (isSequence) {
                startTime = animEnd;
                endTime = animEnd;
            }
            else {
                endTime = Math.max(endTime, animEnd);
            }
        });

        return endTime;
    }

    function runAnimation(el) {
        var startingAnim = el.querySelector('.anim');

        Array.from(startingAnim.children).forEach(function (el) {
            el.setAttribute('data-time-padding', 0.6);
        });

        doAnim(startingAnim, 0);
    }

    window.runAnimation = runAnimation;
})();