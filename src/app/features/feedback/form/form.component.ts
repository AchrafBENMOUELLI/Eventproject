/*import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../shared/data/feedback.service';
import { feedback } from '../../../models/feedback';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  feedback: feedback = {
    id: 0,         // will generate random on submit
    id_user: 1,    // always 1
    id_event: 0,   // set from URL
    content: '',
    rate: 0,
    date: new Date() // today
  };

  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = +this.route.snapshot.paramMap.get('eventId')!; // fetch event ID from URL
    this.feedback.id_event = eventId; // set it once
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.feedback.id = this.generateRandomId(); // random ID on submit

      this.feedbackService.createFeedback(this.feedback).subscribe({
        next: () => {
          alert('Feedback submitted!');
          form.resetForm();
          this.feedback.content = '';
          this.feedback.rate = 0;
          this.feedback.date = new Date(); // reset date to today
        },
        error: (err) => {
          console.error(err);
          alert('Error submitting feedback');
        }
      });
    }
  }

  deleteFeedback() {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(this.feedback.id).subscribe({
        next: () => {
          alert('Feedback deleted!');
          this.feedback.id = 0;
          this.feedback.content = '';
          this.feedback.rate = 0;
          this.feedback.date = new Date();
        },
        error: (err) => {
          console.error(err);
          alert('Error deleting feedback');
        }
      });
    }
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000000); // random ID
  }

  get todayString(): string {
    return this.feedback.date.toISOString().split('T')[0];
  }
}*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../../shared/data/feedback.service';
import { AuthService } from '../../../shared/data/auth.service';
import { Feedback } from '../../../models/feedback';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  feedback: Feedback = {
    id_user: '',       // ← Sera rempli automatiquement
    id_event: '',      // ← Récupéré depuis l'URL
    content: '',
    rate: 0,
    date: new Date()
  };

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('⚠️ Vous devez être connecté pour laisser un commentaire');
      this.router.navigate(['/login']);
      return;
    }

    // Remplir automatiquement l'id_user
    this.feedback.id_user = currentUser._id!;

    // Récupérer l'ID de l'événement depuis l'URL
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.feedback.id_event = eventId;
    } else {
      alert('❌ ID de l\'événement manquant');
      this.router.navigate(['/events']);
    }
  }

  /////////////////////////////////////////////////
  // Soumettre le feedback
  /////////////////////////////////////////////////
  onSubmit(form: any) {
    if (!form.valid) {
      alert('⚠️ Veuillez remplir tous les champs correctement');
      return;
    }

    // Validation supplémentaire
    if (!this.feedback.content || this.feedback.content.trim().length < 3) {
      alert('⚠️ Le commentaire doit contenir au moins 3 caractères');
      return;
    }

    if (this.feedback.rate < 1 || this.feedback.rate > 5) {
      alert('⚠️ La note doit être entre 1 et 5');
      return;
    }

    console.log('Feedback à créer:', this.feedback);

    this.feedbackService.createFeedback(this.feedback).subscribe({
      next: (createdFeedback) => {
        console.log('Feedback créé:', createdFeedback);
        alert('✅ Commentaire ajouté avec succès !');

        // Rediriger vers les détails de l'événement
        this.router.navigate(['/events/details', this.feedback.id_event]);
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);

        if (err.error && err.error.message) {
          alert(`❌ Erreur: ${err.error.message}`);
        } else {
          alert('❌ Erreur lors de l\'ajout du commentaire');
        }
      }
    });
  }

  /////////////////////////////////////////////////
  // Annuler et retourner
  /////////////////////////////////////////////////
  cancel() {
    if (confirm('Êtes-vous sûr de vouloir annuler ?')) {
      this.router.navigate(['/events/details', this.feedback.id_event]);
    }
  }

  /////////////////////////////////////////////////
  // Réinitialiser le formulaire
  /////////////////////////////////////////////////
  reset() {
    this.feedback.content = '';
    this.feedback.rate = 0;
    this.feedback.date = new Date();
  }

  /////////////////////////////////////////////////
  // Obtenir la date au format string pour l'input
  /////////////////////////////////////////////////
  get todayString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
