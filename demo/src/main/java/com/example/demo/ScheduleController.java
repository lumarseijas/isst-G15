import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;

@Controller
public class ScheduleController {

    @GetMapping("/schedule")
    public String showSchedule(Model model) {
        List<String> employees = Arrays.asList("Beatriz", "Andrés", "Laura");
        List<String> services = Arrays.asList("Peluquería", "Depilación", "Manicura");
        List<String> hours = Arrays.asList("09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00");
        
        Map<String, Map<String, String>> schedule = new HashMap<>();
        for (String hour : hours) {
            schedule.put(hour, new HashMap<>());
            for (String employee : employees) {
                schedule.get(hour).put(employee, ""); // Inicialmente sin reservas
            }
        }
        
        model.addAttribute("employees", employees);
        model.addAttribute("services", services);
        model.addAttribute("schedule", schedule);
        model.addAttribute("hours", hours);
        
        return "schedule";
    }
}
