rpd = renderPageData;

$(document).ready(function() {
    function renderAll (){
        var propertyDetails = getPropertyDetails();
        renderPageData('#centre_info_container','#centre_info_template',propertyDetails, 'property_details')
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        promo_details = getEventDetailsBySlug(slug);
        renderPageData('#breadcrumb_container','#breadcrumb_template',promo_details, 'promo_details')
        renderPageData('#banner_container','#banner_template',promo_details, 'promo_details')
        render_page_details("#promo_container", "#promo_template", promo_details)
        
        $.getScript("http://cdn.jsdelivr.net/slimbox/2.0.5/js/slimbox2.js");
        $('head').append('<link rel="stylesheet" href="http://cdn.jsdelivr.net/slimbox/2.0.5/css/slimbox2.css" type="text/css" media="screen" />');
      
        $("#loading_screen").hide();
        $("#main_content").show();
    }
    

    function renderPageData(container, template, collection, type){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        if (type == "property_details" || type == "promo_details"){
            item_list.push(collection);
            collection = []
            collection = item_list;
        }
        $.each( collection , function( key, val ) {
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);

        });
        
        $(container).show();
        $(container).html(item_rendered.join(''));
    };
    
    function render_page_details(container, template, collection){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(template).html();
        Mustache.parse(template_html);   // optional, speeds up future uses
        item_list.push(collection);
        $.each( item_list , function( key, val ) {
            
            if ((val.event_image_url).indexOf('missing.png') > -1){
                if (val.eventable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.eventable_id);
                    val.alt_event_image_url = getImageURL(store_details.store_front_url);
                    val.store_detail_btn = store_details.slug 
                    val.store_name = store_details.name
                    
                } else {
                    val.alt_event_image_url = "http://kodekloud.s3.amazonaws.com/sites/553912c46e6f645bc2000000/d9b90a9aff278549145256be3534ff76/default.jpg"
                }
                
            } else {
                if (val.eventable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.eventable_id);
                    val.store_detail_btn = store_details.slug 
                    val.store_name = store_details.name
                    
                }
                val.alt_event_image_url = getImageURL(val.event_image_url);
                
            }
            start = new Date (val.start_date);
            end = new Date (val.end_date);
            start.setDate(start.getDate()+1);
            end.setDate(end.getDate()+1);
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();
            
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);
            
        });
        $(container).show();
        $(container).html(item_rendered.join(''));
        if (collection.eventable_type == "Store"){
            $("#store_btn").show();
        }
    }
    
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

});