
var in_report_opts = [
"meeting_code", "organizer_email", "identifier", "display_name", "duration_seconds", 
"is_external", "device_type", "end_of_call_rating", "ip_address", "location_region", 
"location_country", "network_rtt_msec_mean", "network_transport_protocol", "calendar_event_id", 
"network_recv_jitter_msec_mean", "network_recv_jitter_msec_max", "network_send_jitter_msec_mean",
"screencast_recv_bitrate_kbps_mean", "screencast_recv_long_side_median_pixels", "screencast_recv_packet_loss_max",
"screencast_recv_packet_loss_mean", "screencast_recv_seconds", "screencast_recv_short_side_median_pixels", 
"screencast_send_bitrate_kbps_mean", "screencast_send_fps_mean", "screencast_send_long_side_median_pixels",
"screencast_send_packet_loss_max", "screencast_send_packet_loss_mean", "screencast_send_seconds",
"screencast_send_short_side_median_pixels", "video_recv_fps_mean", "video_recv_long_side_median_pixels",
"video_recv_packet_loss_max", "video_recv_packet_loss_mean", "video_recv_seconds",
"video_recv_short_side_median_pixels", "network_congestion", "video_send_bitrate_kbps_mean",
"video_send_long_side_median_pixels", "video_send_packet_loss_max", "video_send_packet_loss_mean"
];

var headers = ['Time', 'User'];
headers = headers.concat(in_report_opts);

function generateReport(filter) {
 
  var rows = getMeetReport(filter);
  var spreadsheet;
  
  if (rows.length > 0) {
    //spreadsheet = SpreadsheetApp.openByUrl(doc_url);
    spreadsheet = SpreadsheetApp.create("meet_report_" + filter);
    var sheet = spreadsheet.getSheets()[0];

    // Append the headers.
    sheet.appendRow(headers);

    // Append the results.
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);    

    Logger.log('Report spreadsheet created: %s', spreadsheet.getUrl());
  } else {
    Logger.log('No results returned.');
  }
  
  moveReport(spreadsheet);
  
  var linkDoc = spreadsheet.getUrl();
  return linkDoc;
}


function getMeetReport(filter){
  
  var rows = [];
  var pageToken;
  var page;
  var e0, values_e0;
  do {
    page = AdminReports.Activities.list('all', 'meet', {
      maxResults: 100,
      eventName: "call_ended",
      filters: filter,
      pageToken: pageToken
    });
    var items = page.items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        
        var row = [
          new Date(item.id.time),
          item.actor.email
        ];
        
        e0 = getParameterValues(item.events[0].parameters);
        values_e0 = getValuesForReport(e0);
        for( var x in values_e0 ){
          row.push( values_e0[x] );
        }
        
        rows.push(row);
        
      }
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  
  return rows;
}

/**
 * Gets a map of parameter names to values from an array of parameter objects.
 * @param {Array} parameters An array of parameter objects.
 * @return {Object} A map from parameter names to their values.
 */
function getParameterValues(parameters) {
  return parameters.reduce(function(result, parameter) {
    var name = parameter.name;
    var value;
    if( parameter.value !== undefined ){
      value = parameter.value;
    }else if (parameter.intValue !== undefined) {
      value = parameter.intValue;
    } else if (parameter.stringValue !== undefined) {
      value = parameter.stringValue;
    } else if (parameter.datetimeValue !== undefined) {
      value = new Date(parameter.datetimeValue);
    } else if (parameter.boolValue !== undefined) {
      value = parameter.boolValue;
    }
    result[name] = value;
    return result;
  }, {});
}

function getValuesForReport(parametersMap){
  var row = [];
  var p, curr_key;
  for( p in in_report_opts ){
    curr_key = in_report_opts[p];
    if( parametersMap[ curr_key ] ){
      row.push( parametersMap[curr_key] );
    }
    else row.push("");
  }
  return row;
}