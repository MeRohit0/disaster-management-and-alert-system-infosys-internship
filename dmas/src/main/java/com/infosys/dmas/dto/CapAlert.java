package com.infosys.dmas.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

@Data
@JacksonXmlRootElement(localName = "alert") // Removed the strict namespace string
@JsonIgnoreProperties(ignoreUnknown = true)
public class CapAlert {

    @JacksonXmlProperty(localName = "identifier")
    private String identifier;

    // Use CapInfo as a child element
    @JacksonXmlProperty(localName = "info")
    private CapInfo info;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CapInfo {
        @JacksonXmlProperty(localName = "event")
        private String event;

        @JacksonXmlProperty(localName = "headline")
        private String headline;

        @JacksonXmlProperty(localName = "description")
        private String description;

        @JacksonXmlProperty(localName = "instruction")
        private String instruction;

        @JacksonXmlProperty(localName = "severity")
        private String severity;

        @JacksonXmlProperty(localName = "urgency")
        private String urgency;

        @JacksonXmlProperty(localName = "area")
        private CapArea area;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CapArea {
        @JacksonXmlProperty(localName = "areaDesc")
        private String areaDesc;
    }
}