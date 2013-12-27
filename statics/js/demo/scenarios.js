var scenarios = (function () {
    
    /* some more:
     * jQ fast
     * Oboe fast
     * jQ mobile
     * Oboe mobile
     * jQ mobile, failing
     * Oboe mobile, failing
     * streaming + historic together
     * a chat session
     * creating an aggregation (Insight) jQ
     * creating an aggregation (Insight) Oboe
     */

    return {
        "2-node-layout":{            
            "items": [
                {
                    "name": "sever",
                    "type": "originServer",
                    "options": {
                        "timeBetweenPackets": 100,
                        "messageSize": 9
                    }
                },
                {
                    "name": "internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1500
                    }
                },
                {
                    "name": "client",
                    "type": "client"
                }
            ]            
        },
        
        "fast-ajax-discrete": {
            "baseOn":"2-node-layout",
            "extensions":{
                "items":[
                    ,,{
                        options:{
                            parseStrategy:"discrete"
                        }
                    }
                ]
            }
        }, 
        
        "fast-ajax-progressive": {
            "baseOn":"2-node-layout",
            "extensions":{
                "items":[
                    ,,{
                        options:{
                            parseStrategy:"progressive"
                        }
                    }
                ]
            }
        },

        "mobile-layout":{
            "items": [
                {
                    "name": "sever",
                    "type": "originServer",
                    "options": {
                        "timeBetweenPackets": 50,
                        "packetMode": "historic"
                    },
                    locations:{
                        where: {y: 93}
                    }
                },
                {
                    "name": "internet-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 800
                    }                    
                },
                {
                    "name": "tower",
                    "type": "relay",
                    "options":{
                        "timeBetweenPackets": inconsistent_packet_spacing
                    }
                },                
                {
                    "name": "internet-gsm",
                    "type": "wire",
                    "options": {
                        "medium":"mobile",
                        "bandwidth": 500,
                        "latency": 800
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "page": "map",
                        "deviceType":"mobile"
                    },
                    "next":[]
                }
            ]            
        },
        
        "mobile-discrete": {
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },

        "mobile-progressive": {
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }                    
                    }
                ]
            }
        },

        "mobile-fail":{
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,
                    {
                        "locations": {
                            "where":     {x:190, y:80}
                        }
                    }
                    ,
                    {
                        "relationships":{
                            "blockedBy":"tunnel"
                        }
                    }
                    ,
                    {   "options":{
                            "failAfter": seconds(4),
                            "retryAfter": seconds(2)
                        }
                    }
                    ,
                    {
                        "name":"tunnel",
                        "type":"barrier",
                        "script": {
                            "client_accepted_response6": function(){
                                this.activateIfNeverShownBefore();
                            },
                            "client_requestAttempt_1": function(){
                                this.schedule(function(){
                                    this.deactivate();
                                }, seconds(3));
                            }
                        }
                    }
                ]
            }            
        },
        
        "mobile-fail-discrete": {
            "baseOn":"mobile-fail",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },

        "mobile-fail-progressive": {
            "baseOn":"mobile-fail",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }
                    }
                ]
            }
        },

        "aggregated-layout":{
            "options":{
                "height":257,
                "colors":"twoSeries"
            },
            "items": [
                {
                    "name": "origin-slow",
                    "type": "originServer",
                    "options": {
                        "timeBetweenPackets": 2000,
                        "messageSize": 9,
                        "packetSequence": evenNumberedPackets
                    }
                },
                {
                    "name": "origin-slow-wire",
                    "type": "wire",
                    "next":["aggregator"],
                    "options": {
                        "bandwidth": 500,
                        "latency": 1200
                    }
                },
                {
                    "name": "origin-fast",
                    "type": "originServer",
                    "options": {
                        "timeBetweenPackets": 750,
                        "initialDelay": 250,
                        "packetSequence": oddNumberedPackets
                    },
                    "locations":{ "where":{x:100, y:200} }
                },
                {
                    "name": "origin-fast-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 800
                    }
                },
                {
                    "name": "aggregator",
                    "type": "aggregatingServer",
                    "options": {
                        "timeBetweenPackets": 1000,
                        "messageSize": Number.POSITIVE_INFINITY
                    },
                    "locations":{ "where":{x:240, y:125} }
                },
                {
                    "name": "client-internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "graph",
                        "aspect": "landscape"
                    },
                    "locations":{ "where":{x:420, y:125} }
                }
            ]
        },
        
        "aggregated-discrete": {
            
            "baseOn":"aggregated-layout",
            "extensions":{
                "items":[
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                    ,,
                    {
                        "options":{
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },
        
        "aggregated-progressive": {

            "baseOn":"aggregated-layout",
            "extensions":{
                "items":[
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }
                    }
                    ,,
                    {
                        "options":{
                            "parseStrategy": "progressive"
                        }
                    }
                ]                
            }
        },
        
        "historic-and-live": {
            "items": [
                {
                    "name": "server",
                    "type": "originServer",
                    "options": {
                        "timeBetweenPackets": fastTimingThenStream,
                        "packetMode": historicPacketsThenLive,
                        "messageSize": Number.POSITIVE_INFINITY
                    }
                },
                {
                    "name": "internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter"
                    }
                }
            ]
        },

        "caching": {
            "options":{
                "height":257,
                "startSimulation":function(modelItems){
                    modelItems.client1.makeRequest();
                }
            },
            "items": [
                {
                    "name": "server",
                    "type": "originServer",
                    "locations":{where:{y:70}}
                },
                {
                    "name": "server-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "cache",
                    "type": "cache",
                    "locations":{where:{x: 180, y:55}},
                    "next": ["internet1", "internet2", "internet3"]
                },
                
                {
                    "name": "internet1",
                    "type": "wire",
                    "options":{
                        latency: 750
                    }
                },
                {
                    "name": "client1",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter"
                    },
                    "locations":{ "where":{x:430, y:75} },
                    "next": []
                }
                ,
                
                
                {
                    "name": "internet2",
                    "type": "wire",
                    "options":{
                        latency: 1500
                    }
                },
                {
                    "name": "client2",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter"
                    },
                    "locations":{ "where":{x:375, y:185} },
                    "script": {
                        "client1_accepted_response1": function(){
                            this.schedule(function(){
                                this.makeRequest();
                            });
                        }
                    },
                    "next": []
                }
                
                ,
                {
                    "name": "internet3",
                    "type": "wire",
                    "options":{
                        latency: 1500
                    }
                },
                {
                    "name": "client3",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter"
                    },
                    "locations":{ "where":{x:245, y:205} },
                    "script": {
                        "client1_accepted_response9": function(){
                            this.schedule(function(){
                                this.makeRequest();
                            });
                        }
                    }
                }
            ]
        }
    };

    function inconsistent_packet_spacing(i) {

        switch(i){
            case 0:
            case 1:
            case 5:
            case 6:
                return 75; // fast    
        }
        return 600; //slow
    }

    function randomBetween(min, max) {
        var range = (max - min);
        return min + (Math.random() * range);
    }

    function fastTimingThenStream(i){

        return (i < 6 ? 100 : randomBetween(750, 2500));
    }

    function historicPacketsThenLive(i) {
        return (i < 6 ? 'historic' : 'live');
    }

    function evenNumberedPackets(i) {
        return (i === -1)?
            0 : i+=2;
    }

    function oddNumberedPackets(i) {
        return (i === -1)?
            1 : i+=2;
    }
    
    function seconds(s){
        return 1000 * s;
    }
    
    
})();   
