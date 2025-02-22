$('svg.radial-progress').each(function (index, value) {
    $(this).find($('circle.complete')).removeAttr('style');
});

$(document).ready(function () {
    $('svg.radial-progress').each(function (index, value) {
        // If svg.radial-progress is approximately 25% vertically into the window when scrolling from the top or the bottom

        // Get percentage of progress
        percent = $(value).data('percentage');
        // Get radius of the svg's circle.complete
        radius = $(this).find($('circle.complete')).attr('r');
        // Get circumference (2πr)
        circumference = 2 * Math.PI * radius;
        // Get stroke-dashoffset value based on the percentage of the circumference
        strokeDashOffset = circumference - (percent * circumference) / 100;
        // Transition progress for 1.25 seconds
        $(this)
            .find($('circle.complete'))
            .animate({ 'stroke-dashoffset': strokeDashOffset }, 1250);
    });
});
