public class ExecutionDemo {

    // Static variable (shared)
    public static Integer staticCounter = 0;

    // Instance variable (new per object)
    public Integer instanceCounter = 0;

    // Static block (runs ONLY once)
    static {
        System.debug('🔥 Static block executed');
        staticCounter++;
    }

    // Instance block (runs EVERY time object is created)
    {
        System.debug('🔁 Instance block executed');
        instanceCounter++;
    }

    // Constructor
    public ExecutionDemo() {
        System.debug('🏗️ Constructor executed');
    }

    // Static method
    public static void staticMethod() {
        System.debug('📌 Static Method called. staticCounter = ' + staticCounter);
    }

    // Instance method
    public void instanceMethod() {
        System.debug('📌 Instance Method called. instanceCounter = ' + instanceCounter);
    }
}