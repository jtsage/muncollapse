/* Cut down version of querystring, with some modernizing */
function Querystring(qs){this.p={};if(qs==null||qs.length==0){return}var args=qs.replace(/\+/g,' ').split('&');for(var i=0;i<args.length;i++){var pair=args[i].split('=');this.p[decodeURIComponent(pair[0])]=((pair.length==2)?decodeURIComponent(pair[1]):name)}}Querystring.prototype.get=function(key,default_){var value=this.p[key];return(value!=null)?value:default_}

function refreshZoom(query, form, image, divOverlay) {
    //INIT
    var qs = new Querystring(query);
    
    init();

    var highLighter = document.getElementById('image-overlay');
    refreshImg();
    
    var start_epoch = parseInt(qs.get("rst_start_epoch", form.start_epoch.value),10);
    var stop_epoch = parseInt(qs.get("rst_stop_epoch", form.stop_epoch.value),10);

    var gutterOffsetLeft = 66;
    var graph_shown_width;
    var epoch_shown_start;
    var epoch_shown_stop;
    var eachPixelEpoch;
    var highlightStartX = 0;

    form.plugin_name.onblur = refreshImg;
    form.start_iso8601.onblur = majDates;
    form.stop_iso8601.onblur = majDates;
    form.start_epoch.onblur = function() { refreshImg(); updateStartStop(); };
    form.stop_epoch.onblur = function() { refreshImg(); updateStartStop(); };
    form.lower_limit.onblur = refreshImg;
    form.upper_limit.onblur = refreshImg;
    form.size_x.onblur = refreshImg;
    form.size_y.onblur = refreshImg;
    form.btnReset.onclick = reset;

    // Sets the onClick handler
    image.onclick = click;
    var clickCounter = 0;

    //FUNCTIONS
    function init() {
        form.plugin_name.value = qs.get("plugin_name", "localdomain/localhost.localdomain/if_eth0");
        form.start_epoch.value = qs.get("start_epoch", "1236561663");
        form.stop_epoch.value = qs.get("stop_epoch", "1237561663");
        form.lower_limit.value = qs.get("lower_limit", "");
        form.upper_limit.value = qs.get("upper_limit", "");
        form.size_x.value = qs.get("size_x", "");
        form.size_y.value = qs.get("size_y", "");

        updateStartStop();
    }

    function reset(event) {
        init();

        //Can be not the initial ones in case of manual refresh
        form.start_epoch.value = start_epoch;
        form.stop_epoch.value = stop_epoch;
        updateStartStop();

        //Redraw
        scale = refreshImg();

        //Reset gui
        clickCounter = 0;

        image.onmousemove = undefined;
        form.start_iso8601.disabled = false;
        form.stop_iso8601.disabled = false;
        form.start_epoch.disabled = false;
        form.stop_epoch.disabled = false;
    }

    function refreshImg(event) {
        image.src = qs.get("cgiurl_graph", "/munin-cgi/munin-cgi-graph") + "/"
            + form.plugin_name.value
            + "-pinpoint=" + parseInt(form.start_epoch.value) + "," + parseInt(form.stop_epoch.value)
            + ".png"
            + "?"
            + "&lower_limit=" + form.lower_limit.value
            + "&upper_limit=" + form.upper_limit.value
            + "&size_x=" + form.size_x.value
            + "&size_y=" + form.size_y.value
        ;
    }

    function updateStartStop() {
        form.start_iso8601.value = new Date(form.start_epoch.value * 1000).toLocaleString();
        form.stop_iso8601.value = new Date(form.stop_epoch.value * 1000).toLocaleString();
    }

    function majDates(event) {
        var lowLimit = new Date(),
            topLimit = new Date(),
            date_parsed = null;

        lowLimit.setFullYear(lowLimit.getFullYear() - 1);
        lowLimit.setMilliseconds(0);
        topLimit.setMilliseconds(0);

        date_parsed = new Date(Date.parse(form.start_iso8601.value) || lowLimit.getTime());
        form.start_epoch.value = date_parsed.getTime() / 1000;
        form.start_iso8601.value = date_parsed.toISOString();

        date_parsed = new Date(Date.parse(form.stop_iso8601.value) || topLimit.getTime());
        form.stop_epoch.value = date_parsed.getTime() / 1000;
        form.stop_iso8601.value = date_parsed.toISOString();

        refreshImg();
    }

    function click(event) {
        var relativeClickX = getClickLocation(event);

        switch ((clickCounter++) % 2) {
            case 0: // First click of the displayed graph
                graph_shown_width = parseInt(form.size_x.value, 10);
                epoch_shown_start = parseInt(form.start_epoch.value,10);
                epoch_shown_stop  = parseInt(form.stop_epoch.value, 10);
                eachPixelEpoch    = ((epoch_shown_stop - epoch_shown_start) / graph_shown_width);

                form.start_iso8601.disabled = true;
                form.stop_iso8601.disabled = true;
                form.start_epoch.disabled = true;
                form.stop_epoch.disabled = true;
                
                highlightStartX = event.pageX;
                highLighter.style.left = (relativeClickX + gutterOffsetLeft + image.offsetLeft) + "px";
                highLighter.style.display = "block";

                form.start_epoch.value = offsetEpoch(relativeClickX);
                updateStartStop();

                image.onmousemove = divMouseMove;
                break;
            case 1: // Second (end) click of the displayed graph
                var thisEpoch = offsetEpoch(relativeClickX);
                image.onmousemove = undefined;
                form.start_iso8601.disabled = false;
                form.stop_iso8601.disabled = false;
                form.start_epoch.disabled = false;
                form.stop_epoch.disabled = false;

                highLighter.style.left = "0px";
                highLighter.style.width = "2px";
                highLighter.style.display = "none";

                // For negative values, assume we want a new start point and the old end point.
                if ( thisEpoch > form.start_epoch.value ) { 
                    form.stop_epoch.value = thisEpoch;
                }
                refreshImg();
                break;
        }
    }

    function divMouseMove(event) {
        var diff           = event.pageX - highlightStartX,
            relativeClickX = getClickLocation(event);

        form.stop_epoch.value = offsetEpoch(relativeClickX);
        updateStartStop();

        highLighter.style.width = ((diff < 2) ? 2 : diff) + "px";
    }

    function offsetEpoch(clickX) {
        if ( clickX < 0 ) {
            return epoch_show_start; 
        }

        if ( clickX > graph_shown_width ) {
            return epoch_shown_stop;
        }

        return epoch_shown_start + (clickX * eachPixelEpoch);
    }

    function getClickLocation(event) {
        return ( event.pageX - image.getBoundingClientRect().x - gutterOffsetLeft );
    }
};
