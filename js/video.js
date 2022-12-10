// This script implements the Video class.
// -----------------------------------------------------------------------------

// Video represents a YouTube video.
class Video {
    // Constructs a new Video from the given HTML element.
    constructor(element) {
        this.element = element;
        this.display = element.style.display;
        this.id = undefined;
        this.title = undefined;
        this.viewed = undefined;
    }

    // -------------------------------------------------------------------------

    // Returns the ID of the YouTube URL associated with this Video.
    deriveURL() {
        // List of selectors that could match hyperlink tags associated with this Video.
        const selectors = [
            ":scope a#video-title.yt-simple-endpoint.style-scope.ytd-grid-video-renderer", // Grid
            ":scope a#video-title-link.yt-simple-endpoint.style-scope.ytd-rich-grid-media", // Home
            ":scope a.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer", // Playlist page
            ":scope a.yt-simple-endpoint.style-scope.ytd-playlist-panel-video-renderer", // Playlist panel
            ":scope a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer", // Recommendations
            ":scope a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer", // Search
        ].join(", ");

        // Find a hyperlink tag associated with this Video.
        const hyperlink = this.element.querySelector(selectors);
        if (hyperlink === null) {
            Logger.warning("Video.deriveURL(): failed to find hyperlink element for Video", this.element, ".");
            return undefined;
        }

        // Extract the relative Video URL from the YouTube URL.
        // TODO: Use a positive lookbehind assertion instead of a capture group.
        const regex = /v=([a-zA-Z0-9_\-]+)/;
        const href = hyperlink.getAttribute("href");
        const matches = href.match(regex);
        if (matches === null) {
            Logger.warning("Video.deriveURL(): failed to find relative Video URL in attribute", href, "for Video", this.element, ".");
            return undefined;
        }
        return matches[1];
    }

    // Returns a hierarchical path to the HTML element associated with this Video.
    derivePath() {
        let path = "/";
        // Iterate from the HTML node associated with this Video to the root HTML node.
        for (let node = this.element; node.id !== undefined; node = node.parentNode) {
            // The current HTML node can be identified relative to its parent HTML node by its NodeList index.
            let index = 0;
            for (let sib = node.previousSibling; sib !== null; sib = sib.previousSibling) {
                ++index;
            }
            // Prepend the index to the hierarchical path.
            path = "/" + index + path;
        }
        return path;
    }

    // Fetches the ID of this Video.
    fetchID() {
        const url = this.deriveURL();
        const path = this.derivePath();
        const legal = url && path;
        this.id = legal ? path + url : undefined;
        return this.id;
    }

    // Returns the ID of this Video.
    getID() {
        return this.id || this.fetchID();
    }

    // Fetches the title of this Video.
    fetchTitle() {
        // Find the title tag associated with this Video.
        const title = this.element.querySelector(":scope #video-title[title]");
        if (title === null) {
            Logger.warning("Video.fetchTitle(): failed to find title element for Video", this.element, ".");
            return undefined;
        }

        this.title = title.getAttribute("title");
        return this.title;
    }

    // Returns the title of this Video.
    getTitle() {
        return this.title || this.fetchTitle();
    }

    // Returns the view state of this Video.
    getViewed(threshold) {
        // Find the progress bar tag associated with this Video.
        const bar = this.element.querySelector("div#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer");
        if (bar === null) {
            Logger.debug("Video.fetchViewed(): failed to find bar element for Video", this.element, ".");
            //return undefined;
        }

        // Find the date metadata
        //       const vidmetadata = this.element.querySelector("div#metadata-line.ytd-grid-video-renderer-span.ytd-grid-video-renderer");

        // This is on channel's page
        var divTag = "div#metadata-line.ytd-grid-video-renderer.ytd-grid-video-renderer";

        // This is on the homepage
        divTag = "div#metadata-line.style-scope.ytd-video-meta-block";

        const vidmetadata = this.element.querySelector(divTag);


        var theDate = null;

        if (vidmetadata != null) {

            // This is for the homepage
            if (vidmetadata.childNodes[3] != null) {
                if (vidmetadata.childNodes[3].childNodes[0] != null) {
                    
                    // console.log("vidmetadataasdf: " + vidmetadata.childNodes[3].childNodes[0].data + " ");

                    // console.log('qwerqwerqwer: ' + vidmetadata.querySelector("#metadata-line > span:nth-child(4)").innerHTML)

                    // theDate = vidmetadata.childNodes[3].childNodes[0].data;

                    theDate = vidmetadata.querySelector("#metadata-line > span:nth-child(4)").innerHTML;
                }
            }

        }

        // console.log('qwerqwerqwer: ' + document.querySelector("#metadata-line > span:nth-child(4)").innerHTML);

        console.log("theDate: " + theDate + " ");

        // Determine whether the Video's progress surpasses the progress threshold.
        //        const width = bar.style.width.slice(0, -1);
        //        const progress = parseInt(width, 10);
        //        const age = parseInt(width, 10);
        // TODO: reinstate viewed threshold stuff        
        //        this.viewed = progress >= threshold;
        //        this.viewed = age <= threshold;

        if (theDate != null) {
            // if (!theDate.includes("day") && !theDate.includes("hour") && !theDate.includes("minute")) {
            // if (!theDate.includes("days")) {
            // if (!theDate.includes("hour")) {
            if (!theDate.includes("minute") && !theDate.includes("hour") && !theDate.includes("1 day") && !theDate.includes("2 days") && !theDate.includes("3 days")) {
                this.viewed = true;
                console.log("BANG");
            }
        }

        return this.viewed;
    }

    // -------------------------------------------------------------------------

    // Hides this Video.
    hide() {
        this.element.style.display = "none";
    }

    // Shows this Video.
    show() {
        this.element.style.display = this.display;
    }
}