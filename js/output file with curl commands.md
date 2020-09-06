TRY 1
-----
        with line 6
    
        TRY 1.1
        -------
        Command
        curl --data "foo=bar&baz=qux" http://localhost:3000/hello
        
        Output
        hello : {"foo":"bar","baz":"qux"}
        
        TRY 1.2
        -------
        Command
        curl -d '{"foo":"bar","baz ":"qux"}' -H "Content-Type: application/json" http://127.0.0.1:3000/hello --verbose
        
        Output
        hello : {"foo":"bar","baz":"qux"}
        
        TRY 1.3
        -------
        Command
        curl -d '{"foo":"bar","baz ":"qux"}' http://127.0.0.1:3000/hello --verbose
        
        Output
        hello : {"{\"foo\":\"bar\",\"baz \":\"qux\"}":""}       
 
TRY 2
-----
    without line 6
    
    Command
    curl -d '{"foo":"bar","baz ":"qux"}' -H "Content-Type: application/json" http://127.0.0.1:3000/hello --verbose
    
    Output
    hello : {"foo":"bar","baz":"qux"}
 
 