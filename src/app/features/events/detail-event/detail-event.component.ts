/*import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/data/events.service';
import { FeedbackService } from '../../../shared/data/feedback.service';
import { Eventy } from '../../../models/eventy';
import { feedback } from '../../../models/feedback';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.css']
})
export class DetailEventComponent implements OnInit {
  currentEvent: Eventy | null = null;
  feedbacks: feedback[] = [];
  eventId: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {

    this.eventId = +this.route.snapshot.params['id'];


    this.eventService.getEventById(this.eventId).subscribe((event: Eventy) => {
      this.currentEvent = event;
    });


    this.loadFeedbacks();
  }


  private loadFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe((allFeedbacks: feedback[]) => {
      this.feedbacks = allFeedbacks.filter(f => f.id_event === this.eventId);
      console.log('Feedbacks for event', this.eventId, this.feedbacks);
    });
  }


  onDeleteFeedback(feedbackId: number) {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {

        this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
        alert('Feedback deleted!');
      },
      error: (err) => {
        console.error(err);
        alert('Error deleting feedback');
      }
    });
  }


  onUpdateFeedback(f: feedback) {

    console.log('Update feedback clicked:', f);

  }
}*/
/////////////////////////////////////////////////////////////////////////////////////////
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/data/events.service';
import { FeedbackService } from '../../../shared/data/feedback.service';
import { AuthService } from '../../../shared/data/auth.service';
import { Eventy } from '../../../models/eventy';
import { Feedback } from '../../../models/feedback';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.css']
})
export class DetailEventComponent implements OnInit {
  currentEvent: Eventy | null = null;
  feedbacks: Feedback[] = [];
  eventId: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private feedbackService: FeedbackService,
    public authService: AuthService  // ← public pour l'utiliser dans le template
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.loadEvent();
    this.loadFeedbacks();
  }

  /////////////////////////////////////////////////
  // Charger l'événement
  /////////////////////////////////////////////////
  private loadEvent() {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event: Eventy) => {
        this.currentEvent = event;
        console.log('Événement chargé:', event);
      },
      error: (err) => {
        console.error('Erreur chargement événement:', err);
      }
    });
  }

  /////////////////////////////////////////////////
  // Charger les feedbacks de cet événement
  /////////////////////////////////////////////////
  private loadFeedbacks() {
    this.feedbackService.getFeedbacksByEvent(this.eventId).subscribe({
      next: (feedbacks: Feedback[]) => {
        this.feedbacks = feedbacks;
        console.log('Feedbacks chargés:', feedbacks);
      },
      error: (err) => {
        console.error('Erreur chargement feedbacks:', err);
      }
    });
  }

  /////////////////////////////////////////////////
  // Vérifier si l'utilisateur peut modifier/supprimer le feedback
  /////////////////////////////////////////////////
  canEditFeedback(feedback: Feedback): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    // L'utilisateur peut modifier son propre feedback OU l'admin peut tout modifier
    const feedbackUserId = typeof feedback.id_user === 'string'
      ? feedback.id_user
      : feedback.id_user._id;

    return currentUser._id === feedbackUserId || this.authService.isAdmin();
  }

  /////////////////////////////////////////////////
  // Supprimer un feedback
  /////////////////////////////////////////////////
  onDeleteFeedback(feedbackId: string) {
    if (!confirm('Voulez-vous vraiment supprimer ce feedback ?')) return;

    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f._id !== feedbackId);
        alert('Feedback supprimé !');
        console.log('Feedback supprimé');
      },
      error: (err) => {
        console.error('Erreur suppression feedback:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  /////////////////////////////////////////////////
  // Mettre à jour un feedback (TODO: ouvrir un modal)
  /////////////////////////////////////////////////
  onUpdateFeedback(f: Feedback) {
    console.log('Modifier feedback:', f);
    // TODO: Implémenter un modal pour éditer
  }

  /////////////////////////////////////////////////
  // Incrémenter les likes de l'événement
  /////////////////////////////////////////////////
  incrementLike() {
    if (!this.authService.isLoggedIn()) {
      alert('⚠️ Vous devez être connecté pour liker un événement');
      return;
    }

    if (this.currentEvent && this.currentEvent._id) {
      this.eventService.incrementLike(this.currentEvent._id).subscribe({
        next: (updatedEvent: Eventy) => {
          this.currentEvent = updatedEvent;
          console.log('Like ajouté');
        },
        error: (err) => {
          console.error('Erreur like:', err);
        }
      });
    }
  }

  /////////////////////////////////////////////////
  // Décrémenter les likes de l'événement
  /////////////////////////////////////////////////
  decrementLike() {
    if (!this.authService.isLoggedIn()) {
      alert('⚠️ Vous devez être connecté pour unliker un événement');
      return;
    }

    if (this.currentEvent && this.currentEvent._id && this.currentEvent.nbrLike > 0) {
      this.eventService.decrementLike(this.currentEvent._id).subscribe({
        next: (updatedEvent: Eventy) => {
          this.currentEvent = updatedEvent;
          console.log('Like retiré');
        },
        error: (err) => {
          console.error('Erreur unlike:', err);
        }
      });
    }
  }

  /////////////////////////////////////////////////
  // Vérifier si l'utilisateur connecté est l'organisateur
  /////////////////////////////////////////////////
  isOrganizer(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.currentEvent) return false;

    const organizerId = typeof this.currentEvent.organizerId === 'string'
      ? this.currentEvent.organizerId
      : this.currentEvent.organizerId._id;

    return currentUser._id === organizerId || this.authService.isAdmin();
  }
}
