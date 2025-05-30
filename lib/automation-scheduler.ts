export class AutomationScheduler {
    private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
    static async processAllAutomations(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/api/automations/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`Automation processing failed: ${response.statusText}`)
        }
  
        return await response.json()
      } catch (error) {
        console.error("Error in automation processing:", error)
        throw error
      }
    }
  
    static async processWellnessChecks(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/api/automations/wellness-checks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`Wellness checks processing failed: ${response.statusText}`)
        }
  
        return await response.json()
      } catch (error) {
        console.error("Error processing wellness checks:", error)
        throw error
      }
    }
  
    static async processMedicationReminders(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/api/automations/medication-reminders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`Medication reminders processing failed: ${response.statusText}`)
        }
  
        return await response.json()
    } catch (error) {
      console.error("Error processing medication reminders:", error);
      throw error;
    }
  }
}
