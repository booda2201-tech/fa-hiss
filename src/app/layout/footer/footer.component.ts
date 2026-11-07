import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTACT, FOOTER_GROUPS, SOCIAL_LINKS } from '../../core/config/site.config';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { NewsletterFormComponent } from '../../shared/ui/newsletter-form/newsletter-form.component';

/** Static, config-driven footer. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, IconComponent, NewsletterFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  host: { class: 'relative block overflow-hidden bg-[#4a080c] text-white' },
})
export class FooterComponent {
  protected readonly groups = FOOTER_GROUPS;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();

  protected onSubscribed(_email: string): void {
    // TODO: send to the newsletter API / mailing provider.
  }
}
