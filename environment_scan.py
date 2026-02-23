"""
Simple Webcam Environment Scanner
Team: HamLerc

Scans environment from webcam and describes it in 2 lines
"""

import torch
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from PIL import Image
import cv2
import time
import pyttsx3


class SimpleScanner:
    """
    Simple environment scanner using webcam
    """
    
    def __init__(self):
        """Initialize the scanner with Qwen2-VL model"""
        print("=" * 70)
        print("ENVIRONMENT SCANNER - Loading...")
        print("=" * 70)
        
        # Check device
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Device: {self.device}")
        
        # Load model
        print("Loading Qwen2-VL-2B-Instruct model...")
        self.model = Qwen2VLForConditionalGeneration.from_pretrained(
            "Qwen/Qwen2-VL-2B-Instruct",
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto",
            trust_remote_code=True
        )
        self.processor = AutoProcessor.from_pretrained(
            "Qwen/Qwen2-VL-2B-Instruct", 
            trust_remote_code=True
        )
        self.model.eval()
        
        print("✓ Model loaded successfully!")
        print("=" * 70)
    
    def describe_scene(self, image: Image.Image) -> str:
        """
        Describe the scene in 2 clear lines
        
        Args:
            image: PIL Image from webcam
            
        Returns:
            2-line description
        """
        # Prompt for environment description
        prompt = """You are helping a visually impaired person understand their surroundings.

Describe this scene in EXACTLY 2 clear sentences. Include:
- Current location/setting (e.g., "You are in a room", "You are outside")
- Important objects: people, furniture, vehicles, shops, signs
- Shop names, bus numbers/destinations if visible
- extract text from bus board, shop names, signs
- Directions (left, right, ahead, behind)

Be specific and helpful. Focus on what's important for navigation.

RESPOND WITH EXACTLY 2 SENTENCES."""

        # Prepare input
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image"},
                    {"type": "text", "text": prompt}
                ]
            }
        ]
        
        text = self.processor.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
        
        inputs = self.processor(
            text=[text],
            images=[image],
            return_tensors="pt"
        ).to(self.device)
        
        # Generate description
        with torch.no_grad():
            output_ids = self.model.generate(
                **inputs,
                max_new_tokens=150,
                temperature=0.7,
                do_sample=True
            )
        
        # Decode
        generated_text = self.processor.batch_decode(
            output_ids,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True
        )[0]
        
        # Extract description
        description = generated_text.split("RESPOND WITH EXACTLY 2 SENTENCES.")[-1].strip()
        
        return description


def main():
    """
    Main function - Run webcam scanner
    """
    print("\n" + "=" * 70)
    print("WEBCAM ENVIRONMENT SCANNER")
    print("Team: HamLerc")
    print("=" * 70)
    print()
    
    # Initialize scanner
    scanner = SimpleScanner()
    
    # Open webcam
    print("\nOpening webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open webcam!")
        print("Make sure your webcam is connected and not being used by another app.")
        return
    
    # Set resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    print("✓ Webcam opened successfully!")
    print()
    print("=" * 70)
    print("CONTROLS:")
    print("  Press SPACE - Scan environment now")
    print("  Press 'q'   - Quit")
    print("=" * 70)
    print("\nReady! Press SPACE to scan your environment...\n")
    
    try:
        while True:
            # Read frame
            ret, frame = cap.read()
            
            if not ret:
                print("⚠️  Failed to read from webcam")
                break
            
            # Display frame
            cv2.imshow('Environment Scanner - Press SPACE to scan, Q to quit', frame)
            
            # Handle keyboard
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                print("\n👋 Quitting...")
                break
            
            elif key == ord(' '):  # Spacebar
                print("\n" + "=" * 70)
                print("🔍 SCANNING ENVIRONMENT...")
                print("=" * 70)
                
                start_time = time.time()
                
                # Convert frame to PIL Image
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image = Image.fromarray(frame_rgb)
                
                # Get description
                description = scanner.describe_scene(image)
                
                scan_time = time.time() - start_time
                
                # Display result
                print()
                print("🔊 DESCRIPTION:")
                print("-" * 70)
                print(description)
                                # Initialize the synthesis engine
                engine = pyttsx3.init()

                # Constraints: Adjust rate and volume for clarity
                engine.setProperty('rate', 175)    # Speed (words per minute)
                engine.setProperty('volume', 1.0)  # Volume (0.0 to 1.0)

                try:
                    print("\n🔊 SPEAKING DESCRIPTION...")
                    engine.say(description)
                    # Block execution until speech is finished
                    engine.runAndWait()
                except Exception as e:
                    print(f"Hardware/Driver Failure: {e}")
                finally:
                    engine.stop()
                print("-" * 70)
                print(f"⏱️  Scan time: {scan_time:.2f} seconds")
                print()
                print("Press SPACE to scan again, Q to quit")
                print()
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    
    finally:
        # Cleanup
        print("\nCleaning up...")
        cap.release()
        cv2.destroyAllWindows()
        print("✓ Done!")

if __name__ == "__main__":
    main()