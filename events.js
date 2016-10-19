rpd = renderPageData;

$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        all_events = getEventsList();
        all_events = all_events.reverse();
        events_array = []
        $.each( all_events , function( key, val ){
            // today = new Date();
            // webDate = new Date(val.show_on_web_date);
            
            today = moment();
            webDate = moment(val.show_on_web_date);
            if (today >= webDate) {
                events_array.push(val)
            } 
        });
        all_events = events_array;
        if (all_events.length > 0 ) {
            renderPageData("#promo_list_container","#promo_list_template", all_events, 'events');    
        } else {
            $("#no_event_container").show();
        }
        $("#loading_screen").hide();
        $("#main_content").show();
        $.getScript("//cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
        $('head').append('<link rel="stylesheet" href="//cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
    }

    function renderPageData(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "property_details"){
            item_list.push(collection);
            collection = []
            collection = item_list;
        }
        $.each( collection , function( key, val ) {
            if (type == "events"){
                if ((val.event_image_url).indexOf('missing.png') > -1){
                if (val.eventable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug 
                    val.store_name = store_details.name
                    val.alt_event_image_url = getImageURL(store_details.store_front_url);    
                } else {
                    val.alt_promo_image_url = "//kodekloud.s3.amazonaws.com/sites/553912c46e6f645bc2000000/d9b90a9aff278549145256be3534ff76/default.jpg"
                }
                } else {
                    val.alt_promo_image_url = getImageURL(val.event_image_url);
                }
                // start = new Date (val.start_date);
                // end = new Date (val.end_date);
                // start.setDate(start.getDate()+1);
                // end.setDate(end.getDate()+1);
                // val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();
                
                var start = moment(val.start_date).tz(getPropertyTimeZone());
                var end = moment(val.end_date).tz(getPropertyTimeZone());
                if (start.format("DMY") == end.format("DMY")){
                	val.dates = start.format("MMM D");
                }
                else {
                	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
                }
                if (val.description.length > 110) {
                   val.description =  val.description.substring(0,100)+'...';
                } 
            }
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);
        });
        $(container).show();
        $(container).html(item_rendered.join(''));
    };
    
    function get_month (id){
        switch(id) {
            case 0:
                month = "Jan"
                break;
            case 1:
                month = "Feb"
                break;
            case 2:
                month = "Mar"
                break;
            case 3:
                month = "Apr"
                break;
            case 4:
                month = "May"
                break;
            case 5:
                month = "June"
                break;
            case 6:
                month = "July"
                break;
            case 7:
                month = "Aug"
                break;
            case 8:
                month = "Sep"
                break;
            case 9:
                month = "Oct"
                break;
            case 10:
                month = "Nov"
                break;
            case 11:
                month = "Dec"
                break;
                
        }
        return month;
    }

    rpd.add(renderAll);
    $(document).trigger('render:ready');    
});
