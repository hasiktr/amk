// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
		var node2 = document_root.getElementById('player-wrap').innerHTML;

	html += node2;
    // while (node) {
        // switch (node.nodeType) { 
        // case Node.ELEMENT_NODE:
		 
				// // html += node.outerHTML;
	 
            // break;
        // case Node.TEXT_NODE:
          // //  html += node.nodeValue;
            // break;
        // case Node.CDATA_SECTION_NODE:
        // //    html += '<![CDATA[' + node.nodeValue + ']]>';
            // break;
        // case Node.COMMENT_NODE:
            // html += '<!--' + node.nodeValue + '-->';
            // break;
        // case Node.DOCUMENT_TYPE_NODE:
            // // (X)HTML documents are identified by public identifiers
            // html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            // break;
        // }
        // node = node.nextSibling;
    // }
	
	// html = html.substring(html.lastIndexOf("display_name"), 500);
	// html = html.substring(0,30);
	 
	 html = parseBetween("user_display_name",",",html); 
	 
    return html;
}


/**
 * Parses substring between given begin string and end string.
 * @param beginString the begin string
 * @param endString the end string
 * @param originalString the original string
 * @returns the substring or null if either tag is not found
 */
function parseBetween(beginString, endString, originalString) {
    var beginIndex = originalString.indexOf(beginString) + 3;
    if (beginIndex === -1) {
        return null;
    }
    var beginStringLength = beginString.length;
    var substringBeginIndex = beginIndex + beginStringLength;
    var substringEndIndex = originalString.indexOf(endString, substringBeginIndex) -1;
    if (substringEndIndex === -1) {
        return null;
    }
    return originalString.substring(substringBeginIndex, substringEndIndex);
}
 
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});