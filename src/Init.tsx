
import { useEffect, useState, useRef } from "react";

import Button from "./atoms/Button";
import Card from "./atoms/Card";
import Input from "./atoms/Input";

interface InitProps {
    setSessionId: React.Dispatch<React.SetStateAction<string>>;
    sessionId: string;
    setValidSession: React.Dispatch<React.SetStateAction<boolean>>;
}

const Init= ({sessionId, setSessionId, setValidSession}: InitProps) => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [mode, setMode] = useState<"continue" | "new">("continue");
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSessionInit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let finalSessionId = sessionId.trim();

        if (mode === "new") {
            finalSessionId = (Math.floor(Math.random() * 2000) + 1).toString();
            setSessionId(finalSessionId);
        }

        if (!finalSessionId) {
            setError("Session ID is required");
            setLoading(false);
            return;
        }

        try{
            const res = await fetch("http://localhost:3000/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionId: sessionId }),
            });

            if (!res.ok) {
                throw new Error("Failed to start session");
            }

            const data = await res.json();

            if (data.valid){
               setValidSession(true);
            }
        } catch (err) {
            console.error("Session initialization error:", err);
            setError("Failed to start session");
            setLoading(false);
        }

        console.log(`${mode === "new" ? "New" : "Existing"} session started:`, finalSessionId);

        setLoading(false);
};
 
        
        // try {
        //     await login(email, password);
        //     navigate("/");
        // } catch (err) {
        //     console.error("Login error:", err);
        //     setError("Failed to log in");

        // } finally {
        //  setLoading(false);
        // }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionId(e.target.value);
    };

    useEffect(()=> {
        if (mode === "new") {
            setSessionId((Math.floor(Math.random() * 2000) + 1).toString());
        }
        else {
            setSessionId("");
            inputRef.current?.focus();
        }
    }, [mode, setSessionId]);

    return (
        <>
            <div className="w-4/5 md:w-3/5 lg:w-2/5 mx-auto h-full flex items-center justify-center">
                <div className="w-[436px]">
                <Card bgColor="primary">
                    <h1 className="text-3xl font-bold text-center mb-4" style={{fontFamily: "'Archivo Black', monospace"}}>Start Chat</h1>
                    
                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <div className="relative rounded flex justify-between mb-4 font-mono font-semibold bg-bg-tertiary overflow-hidden">
                        {/* Sliding background indicator */}
                        <div
                            className={`absolute top-0 h-full w-1/2 bg-secondary transition-transform duration-400 rounded z-0`}
                            style={{
                            transform: mode === "continue" ? "translateX(0%)" : "translateX(100%)",
                            }}
                        />

                        {/* Buttons */}
                        <button
                            type="button"
                            className={`relative z-10 w-1/2 px-4 py-2 transition-colors duration-300 ${
                            mode === "continue" ? "text-text-inverse" : "text-text-primary"
                            }`}
                            onClick={() => setMode("continue")}
                        >
                            Continue Session
                        </button>
                        <button
                            type="button"
                            className={`relative z-10 w-1/2 px-4 py-2 transition-colors duration-300 ${
                            mode === "new" ? "text-text-inverse" : "text-text-primary"
                            }`}
                            onClick={() => setMode("new")}
                        >
                            New Session
                        </button>
                    </div>
                    
                    
                    <form onSubmit={handleSessionInit}>
                        <div className='flex flex-col mb-4'>
                            <label className="text-lg font-semibold mb-2" style={{fontFamily: "'IBM Plex Mono', monospace"}}>Session ID</label>
                            <Input
                                ref={inputRef}
                                placeholder="Enter Session ID"
                                type='text'
                                width="large"
                                focusColor="#F5F5F5"
                                roundedBorder="half"
                                value={sessionId}
                                disabled={mode === "new"}
                                onChange={(e) => {
                                    handleInputChange(e);
                                }}
                            />
                        </div>
                        <div className="flex justify-center mb-4 font-bold" style={{fontFamily: "'IBM Plex Mono', monospace"}}>
                            <Button
                                width="large"
                                hoverColor="secondary"
                                roundedBorder="half"
                                bgColor='primary'
                                onClick={() => console.log('Button clicked')}
                            >
                                {loading ? "Starting Session..." : "Start Session"}
                            </Button>
                        </div>
                    </form>
                </Card>
                </div>
            </div>
        </>
    );
}
export default Init